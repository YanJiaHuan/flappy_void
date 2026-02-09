Original prompt: the old repo has a game named flappy_bid (flappy void), which can either run locally and on shared webpage( deploy by using github and github io pages), now i updated my game, add rank function, user function login in sign up, and i have a basically runnable script codes on /new_scripts folder, which i exported from AI studio and google stitch. Now i want you to do a couple of things:
1. update my new game codes based on what i have achieved before and /new_scripts, use my old picures as the visual materials.
2. you should develop both front-ended codes and backend codes, make the whole game function really good.
3. you should use supabase to work as the database to store all necessary information, should be working when:new user login, new record per account,etc
4. you should tell me how to link to supabase
5. i am thinking that maybe you do not need to remove the old codes(except new_scripts, i will manually delete it, so if you will use the inside materials, just copy and edit another folder), you can create a new one in a /dev folder inside the repo, and further i can deploy on vercel, and choose this certain folder /dev to deploy

Notes:
- Created /dev folder for new app; keeping legacy code intact.

Update:
- Created new Vite React app under /dev with Supabase integration and local assets.
- Added game engine (canvas-based) with render_game_to_text + advanceTime hooks, fullscreen toggle.
- Added auth, home, leaderboard, game over screens and Supabase data helpers.
- Added Supabase schema in /dev/supabase/schema.sql and deployment instructions in /dev/README.md.
- Added optional Vercel API endpoints under /dev/api for leaderboard and score submission.

Testing:
- npm install in /dev hung with no output; aborted. Playwright test loop not run due to missing deps.
