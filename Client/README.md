# TechTests Client

The front page of the client should look like a simple login page. It should be possible
to log into the system using two types of user levels - admin, user. There are going
to be separate interfaces for the two.

For the admin interface, the middle page of the screen should show any pending
queries, or answers to be evaluated. If none present, it should show a simple
message like "Nothing to do". A panel on the left should show other
administrative options. The most important of these would be to create a new test.

The creation of the test should follow the same procedure as that of creation
of a google form. The following type of questions are to be supported:
- Single correct multiple choice
- Multiple correct multiple choice
- Single correct/Multiple correct with option to add response (option not present)
- Subjective (more on this later)
- Code Based (more on this later)

## Handling Subjective questions

Since checking of all subjective questions at once is a pain, the panel should implement
a way for the user to freeze his/her answer so that it can be judged while the person is attempting
the rest of the questions. Doing so, would show the question, with the answer on the top of the list
of every logged in admin, and can be judged to be correct/wrong by any of the admins.

The judgements have three variations 
- Correct - question is marked green, uneditable.
- Wrong - question is marked red, uneditable.
- Fix - question is almost correct, but needs some more info to be evaluated as
correct - made editable

On the judgement panel, during the test, the name of the person whose answer
this is, must not be shown (better yet, have an option in settings to flip
this)

## Handling System/Code based questions

This part is the core of this project. The questions should allow for questions whose
answer needs to be evaluated on a docker container (study up on this if you
don't know what docker is). This would allow two fields for the answer. The preparation
code, and the final code whose output is to be monitored.

Next to the input boxes, would be a scrollable box which would show the output of the last
run.
