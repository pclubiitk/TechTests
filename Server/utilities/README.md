# Wrapper

A statically compiled binary which can capture the output of any command.  
This file would be used as a wrapper around the commands for system/code based questions.  
Statically compiled so that it works even on busybox.
The exact working of the wrapper is described below :
```
./wrapper arg1 arg2 arg3
```

`arg1` -> file containing commands to be run, while checking the output of only the last command against contents of file `arg2`  
`arg2` -> file to match the output with  
`arg3` -> file to dump outputs of ALL commands in file `arg1`  

Exit code: `0` if `arg2` file content matches, `1` otherwise.

## Compiling

`wrapper.cpp` can be compiled using:

```
g++ wrapper.cpp -o wrapper -static -static-libgcc -static-libstdc++
```

## Illegal commands and failures
Currently invalid commands do not execute while the rest execute.  
Error handling will be added in the near future as per requirements.
