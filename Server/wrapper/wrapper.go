package main

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"strings"
	"time"
)

var file1 string
var file2 string
var file3 string

func check(e error){
	if e != nil {
		panic(e)
	}
}

func whoami() string{
	cmd := exec.Command("whoami")
	output,err := cmd.Output()
	check(err) // crashes if it does not know the user where it is being run
	return (string(output))
}

func touch(filename string) bool{
	cmd2 := exec.Command("touch", filename)
	err := cmd2.Run()
	if err != nil {
		return false
	}
	return true
}

func writeToOutput(text []byte, file3 string){
	f,err := os.OpenFile(file3, os.O_APPEND | os.O_WRONLY, os.ModeAppend)
	check(err)
	_,err = f.WriteString(string(text))
	check(err)
	f.Close()
}

func main() {
	args := os.Args[1:]
	file1 = args[0]
	file2 = args[1]
	if len(args) < 3{
		file3 = "logger.txt"
	} else {
		file3 = args[2]
	}
	if !touch(file3) {
		os.Exit(2) //exits with Error 2 if it can not create / touch output file or if it exists and can not be removed 
	}
	f,err := os.Open(file1)
	check(err)
	f2,err := os.Open(file2)
	check(err)
	scanner := bufio.NewScanner(f)
	_,err = f.Seek(0,0)
	_,err = f2.Seek(0,0)
	var output []byte
	time1 := time.Now()
	for scanner.Scan() {
		line := scanner.Text()
		lineS := string(line)
		args := strings.Fields(lineS)
		linerS := strings.Join([]string{"$ ",lineS,"\n"},"")
		writeToOutput([]byte(linerS),file3)
		_,err := exec.LookPath(args[0])
		if (err != nil){
			writeToOutput([]byte("**No such command found**"),file3)
		} else {
			cmd := exec.Command(args[0],strings.Join(args[1:]," "))
	//		stdout,err := cmd.StdoutPipe()
			notDone := true
			cmd.Start()
			timer := time.AfterFunc(1*time.Second, func() {
				errr := cmd.Process.Kill()
				check(errr) // crashes the wrapper if it can not kill the process
				writeToOutput([]byte("**Took too long to execute**"),file3)
				notDone = false
			})
			err = cmd.Wait()
			timer.Stop()
			if err != nil && notDone {
				writeToOutput([]byte(err.Error()),file3)
			} else if notDone {
				cmdd := exec.Command(args[0],strings.Join(args[1:]," "))
				output,err = cmdd.Output()
				writeToOutput(output,file3)
			}
		}
	}
	fmt.Println(string(output)) // last output
	f.Close()
	writeToOutput([]byte(strings.Join([]string{string(time.Now().String()), whoami(),string(time.Since(time1))}," ")),file3) //details appended to the log file
	scanned := bufio.NewScanner(f2)
	out,err := os.Open(file3)
	outp := bufio.NewScanner(out)
	// check for same output
	for scanned.Scan() && outp.Scan() {
		line1 := strings.TrimSpace(string(scanned.Text()))
		line2 := strings.TrimSpace(string(outp.Text()))
		if line1 != line2 {
			os.Exit(1)
		}
	}
	// incomplete output
	if(scanned.Scan()) {
		os.Exit(1)
	}
	f2.Close()
	out.Close()
	os.Exit(0)
}
