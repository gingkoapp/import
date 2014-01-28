# Import

  Convert text in markdown format to gingko tree json represenation.
  
## Parsing Markdown Structure
  One possible approach is to take the document as a string, split it on any headers and paragraphs, and use the following rules to determine the appropriate level:
  1. If current block has a heading, level of block = level of heading.
  2. If current block has no heading (e.g. paragraph block), level of block = level of previous block.
  
Once the document has been broken down into an ordered list of blocks, each tagged with level information, should be simple to convert to required JSON format, by starting at the lowest level, and adding children appropriately.

## Gingko json representation

  It's an array of objects, each object has to fields: "content", "children".
  Content is a markdown body of each card, children is an array of objects.

  Canonical, headers structured [Alien-1979 tree](https://gingkoapp.com/alien-1979)
  has to be converted to json like this:

```json
[
  {
    "content": "#Alien\nThe small crew of a deep space towing vessel are awakened  to investigate a strange signal from a planet. Тhey discover it was a warning, not an SOS. They land, explore a hive of eggs, and one member is attacked and infected. Back in the ship, a creature bursts out of the infected member's belly, grows, and begins killing off the crew one at a time. Crew discovers their company knew of creature, and wanted it captured. Ripley emerges as leader, and eventually sole survivor.",
    "children": [
      {
        "content": "##Act 1\n> Introduce the characters of this rusty ship. Each has a role, and a distinct personality. \n\nRipley is clearly a loner. The leader talks to the mission computer in secret. The SOS might be a warning, which is ignored by the leader. Something fishy is going on.\nhttps://docs.google.com/spreadsheet/ccc?key=0AuGKsorSQnvvdDhoWkowcjlsZFBuUVQtRlBkUVVnQ0E&usp=sharing#gid=0",
        "children": [
          { "content": "###Theme Stated\nThe crew gathers around the breakfast table, and banters.\nThe themes of X, Y, and Z are hinted at." },
          { "content": "###Fun and Games\nThe face-hugger is onboard, and plays games with the crew. First, not letting go of Kane's face. Then, acid blood. Finally, hide-and-seek. Eventually, they find the creature dead, and Kane seems to have recovered. All is well?" },
          { "content": "###Opening Image\nA space cruiser rumbles through the void. A computer named \"Mother\" wakes the crew of seven from hypersleep. " },
          { "content": "###Catalyst\nTom tells the crew they've been called to a strange planet by a distress signal. Crew complains, but is told they'll lose their \"shares\" if they don't go on the rescue." },
          { "content": "###Debate\nRipley investigates signal, worries it might be a warning to stay away. Dallas decides to land anyway." }
        ]
      },
      ...
    ]
  }
]
```

## API Example

```js
var readFile = require('fs').readFileSync;
var gingkoImport = require('gingko-import');

// import text file
var text = readFile('./Readme.md', 'utf-8');

// convert markdown to valid json format
var json = gingkoImport(text);
console.log(json);
```
