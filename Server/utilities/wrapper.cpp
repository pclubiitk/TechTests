#include <fstream>
#include <iostream>
#include <string>
#include <sstream>

#include "pstream.h"

std::string exec(const std::string cmd) {

  // run a process and create a streambuf that reads its stdout and stderr
  const redi::pstreams::pmode mode = redi::pstreams::pstdout | redi::pstreams::pstderr;
  redi::ipstream proc(cmd + " 2>&1", mode);

  std::string line, vals = "";

  // read child's stdout
  while (std::getline(proc.out(), line))
    vals += line + '\n';

  return vals;

}

int main(int argc, char** argv) {

  std::ifstream cmdfile(argv[1]);
  std::ifstream reqoutfile(argv[2]);
  std::ofstream outfile(argv[3]);

  std::string line, output, reqout;

  while (getline(cmdfile, line)) {
    // Read one command
    output = exec(line);
    // Print output to outfile
    outfile << output;
  }
  outfile.flush();

  // Read complete expected output file
  while (getline(reqoutfile, line)) {
    reqout += line + "\n";
  }

  // Compare output of last command with that of expected output
  if (output.compare(reqout) == 0)
    return 0;
  return 1;

}
