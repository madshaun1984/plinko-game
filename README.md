# Plinko
<div align="center">
<img src="https://user-images.githubusercontent.com/35928107/190816186-5743b954-d6cc-4c7e-988a-5a01b91a0112.png" width="30%">
<img src="https://user-images.githubusercontent.com/35928107/190816054-d52c48f0-0986-4f96-add4-9b0e497096bd.png" width="30%">
<img src="https://user-images.githubusercontent.com/35928107/190816660-5a369da4-4353-4909-9126-7cded0b4a172.png" width="30%">
<img src="https://user-images.githubusercontent.com/35928107/190814964-0141b02a-d741-460b-8ec2-89c2bac078e1.png" >
<img src="https://user-images.githubusercontent.com/35928107/190815308-052d5240-edb6-45e3-8394-4e79bb253c60.png" width="49%" >
<img src="https://user-images.githubusercontent.com/35928107/190815405-163c0aaa-953e-4187-99ca-0b9f82be5244.png" width="49%">

</div>
## What is this game? 
> This game is a version of the game Plinko, here, you start with 100PPs (plinko points) and you can bet your points to earn more based on the multipliers in the bottom of game.


## How to play?
> Just access the [link](https://www.plinko.kayooliveira.com), select your bet value and click on 'Apostar', or, if you don't want to lose your points, just click directly on 'Apostar' button and the game will put a new ball without value in game.


## Stacks

- React
- Typescript 
- TailwindCSS (Styles)
- Matter-JS (Physics engine)
- Zustand (Manage the states)

---

## Development Setup

NOTE: This is a rough guide for now, a more comprehensive guide will be added when I get some time.

1. Create an app on Firebase & get the required values (will update with a step by step later)
1. Install Node.js
1. Install required modules
1. run ``` mv .env.example .env ```
1. Edit ".env" and update the varaibles with the values retrieved from Firebase
1. (Optional) Edit "main.tsx" and set the remaining variable values as retrieved from Firebase
1. Open VSCode - Install modules as suggested along with the firebase sdk & firebase platform-tools 
1. From the command line run the following commands
	1. cd G:\private-repos\plinko-game
	1. npx vite build
	1. firebase init hosting ### note: set dir to "dist"
	1. (Deploy to Firebase) firebase deploy --only hosting
	1. (Run locally) firebase emulators:start

## Credit for original design & code goes to Kayo Oliveira
