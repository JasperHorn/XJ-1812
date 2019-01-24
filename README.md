
XJ-1812
=======

XJ-1812 is a Discord bot I made because I felt like making it. It all started
with implementing the /slap command from the IRC days and once I was done with
that, I simply added more things. Over time, it even ended up doing some pretty
useful things.

As I decided to put the thing on GitHub, I cleaned up the code, made it more
configurable and even added a system that modularized basically all the
functionality of the bot.

The name
--------

XJ-1812's name is a reference to two science fiction tv shows. I'm not going to
spoil which shows these are, but I can tell you that the first reference is
pretty obvious. The second show is more niche and moreover, the reference is to
a more minor element of that show. However, in the show, it's a reference to
something that's not science fiction that you should definitely be able to
figure out.

Running XJ-1812
---------------

Copy config.model.json to config.json and fill it out in the way that seems
appropriate to you (this requires getting a Discord API key to add in the
configuration).

Install Node, run `npm install` and then `node .` should start the bot.

Customizing XJ-1812
-------------------

The simplest place to start is at xj-1812.js. This file controls which
configuration and functionality is active. It starts bot.js, which you generally
won't need to modify unless you are making really big changes.

If adding new commands is your game, you can look at the files in
command-modules and make something similar. While bot.js does some preliminary
string manipulation to trigger your command when the right text is written in
a channel visible to the bot, basically anything you want to do will go through
the normal methods of the Discord.js API. You only ever get a reference to the
message object, but through `message.client` you will be able to access the
entire API if you need to.
