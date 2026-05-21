1. How to navigate to particular content of same file?
Answer:- Add id to target element(U cannot do same from class)
<main id="main-content">aasd</main>
Create a link with # + the id value
<a href="#main-content">Go to Main Content</a>

2. How to add favicon?
   Answer:- <link rel="icon" href="./bird2.png" type="image/png" />

3. What happens if u add anchor tag inside another tag?
   Answer: Both works

4. What actually is defer in script tag file?
   Answer: defer downloads the script in parallel while HTML is parsing, but waits to run it until HTML parsing finishes.

5. How to load new html page when form is submitted via frontend?
   Answer: Create a form with /action and method /post in index.html, then in .js files add js scripts call html page that u want to display.

6. Pseudo class diff between active,focus and hover
   Answer: FOCUS: When element receives keyboard focus
   ACTIVE: When element is being clicked (mouse down)
   FOCUS: When element receives keyboard focus

7. What is :root?
   Answer: Is used to define variables like below example.
   :root {
   --brand-color: #6A0DAD;
   --spacing: 16px;
   }
   .button {
   background: var(--brand-color);
   padding: var(--spacing);
   }

8) What is the difference between relative and absolute positioning?
Answer: Relative is element stays in normal flow but can be offset.
Absolute is positioned to nearest non-static ancestor(its parent should not be static, if static then it go to normal position)

9) 