#include <fstream>
#include <iostream>
#include <string>
#include <sstream>

#include "libs/pstream.h"

std::string DELIM = "###";

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

  // Redirect error to output too
  output = exec(shfilename + " 2>&1");

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

  // read child's stdout
  while (std::getline(proc.out(), line)) {
    vals += line + '\n';
  }

  return vals;
}

// trim from right
inline std::string& trimSpace(std::string& s, const char* t = " \t") {
  s.erase(s.find_last_not_of(t) + 1);
  return s;
}

// trim from right newline
inline std::string& trim(std::string& s, const char* t = "\n\r") {
  s.erase(s.find_last_not_of(t) + 1);
  return s;
}

// Compare the outputs
bool compareOutputs(std::string out1, std::string out2) {
  return !(trim(out1).compare(trim(out2)));
}

// Generate the sh file for running the commands in arg1
std::string generateShFile(std::string cmdfilename, std::string shfilename) {
  std::ifstream cmdfile(cmdfilename);
  std::ofstream shfile(shfilename);
  std::string line, lastcommand;

  int i = 1;
  while (getline(cmdfile, line)) {
    shfile << "echo \"" << DELIM << " cmd " << i << " : " << line << " " << DELIM << "\"\n";
    shfile << line << "\n";
    lastcommand = DELIM + " cmd " + std::to_string(i) + " : " + line + " " + DELIM;
    i++;
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
    bool found_noendl =false;
    if (found) {
      std::string temp = line;
      our_output += trimSpace(temp) + "\n";
    }
    if (line.length() > 3 && !line.substr(0, 3).compare(DELIM)) {
      if (!line.compare(lastcommand)) {
        found = true;
      }
      outfile << line + "\n";
    } else if (line.length() > 0){
      outfile << line[0];
      std::string newline = "";
      for(int i = 1; i < line.length() - 3; i++) {
        if(!line.substr(i, 3).compare(DELIM)) {
          outfile << "%\n" << line[i];
          found_noendl = true;
        } else {
          outfile << line[i];
        }
        if (found_noendl) {
          newline += line[i];
        }
      }
      if (found_noendl) {
        newline += line.substr(line.length() - 3);
        if (!newline.compare(lastcommand)) {
          found = true;
        }
      }
      outfile << line.substr(line.length() -3) +"\n";
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
    output += trimSpace(line) + "\n";
  }
  file.close();

  return output;
}
