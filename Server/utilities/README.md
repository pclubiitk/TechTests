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

`wrapper.cpp` can be statically compiled using:

```
g++ wrapper.cpp -o wrapper -std=c++11 -static -static-libgcc -static-libstdc++ -I libs
```

Compilation requires the standard `pstreams` [library](http://pstreams.sourceforge.net/) which is available in most major distros - ubuntu, arch  
and is also included in the `libs` folder.

Doesn't matter since we are statically compiling.

## Illegal commands and failures

Due to current limitations, `arg1` should contain only valid `/bin/sh` commands such as:

```
$ cat a.txt | ./a.out
```

instead of 

```
$ ./a.out < cat a.txt
```

Also, currently the checking is not as per CodeChef - (timeout, white space checking).  
They can be implemented easily as and when required.
