# Wrapper

### Compile by :
$ go build wrapper.go

### Features :
1. Logs all kinds of errors
2. Exits if command takes more than 5 seconds to run
3. Statically compiled

### Kinds of errors reported and in format are as follows:
1. No command found : **No such command found**
2. TLE : **Took too long to respond**
3. Execution Error : **Error at time of execution**
4. if no errors : output is written to file
