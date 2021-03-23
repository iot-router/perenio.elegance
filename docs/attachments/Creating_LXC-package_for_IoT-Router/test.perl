#!/usr/bin/perl
print "Hello, world! It's a Perl inside an LXC-package\n";

# Number Guessing Game implementation
# using Perl Programming

print "\nNumber guessing game\n";

$x = int rand 10;

$correct = 0;

$chances = 4;
$n = 0;

print "Guess a number (between 0 and 10): \n";

while($n < $chances)
{
    chomp($userinput = <STDIN>);

    if($userinput != "blank")
    {
        if($x == $userinput)
        {
            $correct = 1;
            last;
        }
        elsif($x > $userinput)
        {
            print "Your guess was too low,";
            print " guess a higher number than ${userinput}\n";
        }
        else
        {
            print "Your guess was too high,";
            print " guess a lower number than ${userinput}\n";
        }
        $n++;

    }
    else
    {
        $chances--;
    }
}
if($correct == 1)
{
    print "You Guessed Correct!\n";
    print " The number was $x\n";
}
else
{
    print "It was actually ${x}.\n"; 
}
