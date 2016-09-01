#include <fstream>
#include <iostream>
#include <string>
#include <sstream>

#include "libs/pstream.h"

// Function to return stdout + stderr
std::string exec(const std::string);
// Compare the outputs
bool compareOutputs(std::string, std::string);
// Generate the sh file for running the commands in arg1
std::string generateShFile(std::string, std::string);
// Read complete expected output file
std::string readFile(std::string);
// Parse the output in required parts
std::string parseOutput(std::string, std::string, std::string);

int main(int argc, char** argv) {
  std::string shfilename = "./cmds.sh";
  std::string lastcommand, output, reqout, our_output;

  lastcommand = generateShFile(argv[1], shfilename);

  // Run and delete temporary file
  exec("chmod +x " + shfilename);

  output = exec(shfilename);

  exec("rm " + shfilename);

  reqout = readFile(argv[2]);

  our_output = parseOutput(lastcommand, output, argv[3]);

  // Compare output of last command with that of expected output
  return !(compareOutputs(our_output, reqout));
}

// Function to return stdout + stderr
std::string exec(const std::string cmd) {
  // run a process and create a streambuf that reads its stdout and stderr
  redi::ipstream proc(cmd, redi::pstreams::pstdout | redi::pstreams::pstderr);

  std::string line, vals = "";

  // read child's stderr
  while (std::getline(proc.err(), line)) {
    vals += "stderr: " + line + '\n';
  }

  proc.clear();

  // read child's stdout
  while (std::getline(proc.out(), line)) {
    vals += "stdout: " + line + '\n';
  }

  return vals;
}

// Compare the outputs
bool compareOutputs(std::string out1, std::string out2) {
  // TODO(yashsriv): Codechef style checking
  return !out1.compare(out2);
}

// Generate the sh file for running the commands in arg1
std::string generateShFile(std::string cmdfilename, std::string shfilename) {
  std::ifstream cmdfile(cmdfilename);
  std::ofstream shfile(shfilename);
  std::string line, lastcommand;

  while (getline(cmdfile, line)) {
    shfile << "echo \"### " << line << " ###\"\n";
    shfile << line << "\n";
    lastcommand = line;
  }
  shfile.close();
  cmdfile.close();

  return lastcommand;
}

// Parse the output in required parts
std::string parseOutput(std::string lastcommand, std::string output, std::string outfilename) {
  std::ofstream outfile(outfilename);
  std::string our_output, line;
  std::stringstream outputstream(output);
  bool found = false;

  while (getline(outputstream, line)) {
    if (found) {
      our_output += line.substr(8) + "\n";
    }
    if (!line.substr(8).substr(0, 3).compare("###")) {
      if (!line.compare("stdout: ### " + lastcommand + " ###")) {
        found = true;
      }
    } else {
      outfile << line + "\n";
    }
  }
  // Print output to outfile
  outfile.close();

  return our_output;
}

// Read complete expected output file
std::string readFile(std::string filename) {
  std::ifstream file(filename);
  std::string output, line;

  while (getline(file, line)) {
    output += line + "\n";
  }
  file.close();

  return output;
}
