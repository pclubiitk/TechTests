#include <cstdio>
#include <fstream>
#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>

using namespace std;

string exec(const char* cmd) {

  char buffer[128];
  string result = "";
  shared_ptr<FILE> pipe(popen(cmd, "r"), pclose);
  if (!pipe) throw runtime_error("popen() failed!");
  while (!feof(pipe.get())) {
    if (fgets(buffer, 128, pipe.get()) != NULL)
      result += buffer;
  }

  return result;

}

int main(int argc, char** argv) {

  ifstream cmdfile(argv[1]);
  ifstream reqoutfile(argv[2]);
  ofstream outfile(argv[3]);

  string line, output, reqout;

  while (getline(cmdfile, line)) {
    output = exec(line.c_str());
    outfile << output;
  }
  outfile.flush();
  while (getline(reqoutfile, line)) {
    reqout += line + "\n";
  }

  if (output.compare(reqout) == 0)
    return 0;
  return 1;

}
