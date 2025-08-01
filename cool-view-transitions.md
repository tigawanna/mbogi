
# AWESOME VIEW TRANSITIONS


## Kevin powell

- [codepen](https://codepen.io/kevinpowell/pen/xbGeNQy/ef22ccea0c2d257ae1a748f5fd4646da)

- [youtube video](https://codepen.io/kevinpowell/pen/xbGeNQy/ef22ccea0c2d257ae1a748f5fd4646da)


```html
<form class="color-picker"> 
  <fieldset> 
     
    <select name="theme" id="theme">
      <option value="💻">System</option>
      <option value="☀️">Light</option>
      <option value="🌑">Dark</option>
    </select>
  </fieldset>
</form>

<main>
  <div class="wrapper">
    <h1>Theme transitions</h1>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati natus error quam suscipit architecto enim nobis vero eaque. Repudiandae quisquam impedit fugiat neque delectus doloremque!</p>
    <p>Rem neque inventore necessitatibus totam incidunt eius reprehenderit quis ipsam officia praesentium, quod vero soluta maxime iure nobis dolorum a quibusdam officiis ratione debitis? Ipsam.</p>
    <h2>Something interesting</h2>
    <div class="auto-grid">
      <div class="card">
        <h3 class="card__title">A medium-length title</h3>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellendus, atque.</p>
      </div>
      <div class="card">
        <h3 class="card__title">A short title</h3>
        <p>Voluptatem excepturi tempore quo recusandae sunt ullam earum optio cum?</p>
      </div>
      <div class="card">
        <h3 class="card__title">A medium-length title</h3>
        <p>Nam laudantium voluptas, tenetur repellendus numquam rem incidunt deleniti veritatis?</p>
      </div>
      <div class="card">
        <h3 class="card__title">A much longer title than the others</h3>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellendus, atque.</p>
      </div>
      <div class="card">
        <h3 class="card__title">A medium-legth title</h3>
        <p>Voluptatem excepturi tempore quo recusandae sunt ullam earum optio cum?</p>
      </div>
      <div class="card">
        <h3 class="card__title">A short title</h3>
        <p>Nam laudantium voluptas, tenetur repellendus numquam rem incidunt deleniti veritatis?</p>
      </div>
    </div>
    <p>Rerum, neque! Consequuntur obcaecati beatae dolorum, fuga itaque iusto dicta et corporis facere ea necessitatibus odit cum, voluptates harum, dolore maiores aliquid distinctio repellendus nesciunt!</p>
    <p>Unde dolor quod delectus obcaecati labore laboriosam optio sit eligendi. Excepturi explicabo quod obcaecati pariatur error, in, accusantium eum omnis repellat qui, aliquid magnam odit?</p>
  </div>
</main>
```

```css
::view-transition-old(root) {
  animation-delay: 500ms;
}

::view-transition-new(root) {
  animation: circle-in 500ms;
/*   animation-timing-function: linear(0, 0.234 11.8%, 0.403 18.4%, 0.624 24.7%, 0.999 33.3%, 0.76 39.9%, 0.705 42.6%, 0.687 45.2%, 0.703 47.7%, 0.753 50.3%, 0.999 57.7%, 0.89 61.8%, 0.865 63.6%, 0.857 65.3%, 0.865 67%, 0.887 68.8%, 0.999 74.5%, 0.957 77.5%, 0.944 80.2%, 0.954 82.7%, 1 88.2%, 0.988 91.9%, 1); */
}

@keyframes move-in {
  from { translate: 0 -100%; }
  to { translate: 0  0; }
}

@keyframes circle-in {
  from { clip-path: circle(0% at 50% 0%); }
  to { clip-path: circle(120% at 50% 0%); }
}


:root {
  @media (prefers-color-scheme: light) {
    --theme: ☀️;
    color-scheme: light;
  }
  
  @media (prefers-color-scheme: dark) {
    --theme: 🌑;
    color-scheme: dark;
  }
}

body {
  color-scheme: light;
  
  --clr-body-bg: hsl(10, 25%, 95%);
  --clr-card-bg: hsl(10, 25%, 98%);
  --clr-text: #232323;
  --clr-heading: hsl(18, 65%, 48%);
  
  @container style(--theme: 🌑) {
    color-scheme: dark;
    
    --clr-body-bg: hsl(173, 10%, 7%);
    --clr-card-bg: hsl(173, 30%, 10%);
    --clr-text: #cbd5e1;
    --clr-heading: hsl(173, 50%, 70%);
  }
}


body {
  font-family: system-ui, sans-serif;
  font-size: 1.25rem;
  line-height: 1.5;
  background: var(--clr-body-bg);
  color: var(--clr-text);
}

h1,
h3 {
  color: var(--clr-heading);
  line-height: 1.1;
}

.auto-grid {
  --min-column-size: 225px;

  display: grid;
  gap: clamp(1rem, 5vmax, 1.625rem);
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, var(--min-column-size)), 1fr)
  );
}

.wrapper {
  --max-width: 55rem;
  width: min(100% - 2rem, var(--max-width));
  margin-inline: auto;
}

.card {
  padding: 1rem;
  background-color: var(--clr-card-bg);
  border-block-start: 0.5rem solid var(--clr-heading);
  border-radius: 0.5rem;
}

.card > * {
  margin: 0;
}

.card > *:not(:last-child) {
  margin-bottom: 0.75rem;
}

.visually-hidden {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

.color-picker > fieldset {
  display: flex;
  gap: 1.5rem;
  padding: 1rem 2rem;
  margin-inline: auto;
  width: min-content;
  border: 0;
  background: canvas;
  border-radius: 0 0 1rem 1rem;
}

```
```js
// You should also save the preference
// so when a user comes back, they don't have
// to set it again.

const themeSelect = document.querySelector('#theme');

function updateTheme(selectedTheme) {
  if (selectedTheme === '💻') {
    document.documentElement.style.removeProperty('--theme');
  } else {
    document.documentElement.style.setProperty('--theme', selectedTheme);
  }
}

themeSelect.addEventListener('change', (event) => {
  const selectedTheme = event.target.value;
  
    if (!document.startViewTransition) {
      updateTheme(selectedTheme);
      return;
    }

    document.startViewTransition(() => {
      updateTheme(selectedTheme);
    });
  
});
```

## Jhey

- [Twitter post](https://codepen.io/jh3y/pen/BaggYwa)

```css
transition: all 0.3s ease;
```
but we can take this further by using the newly added view transitions 

```css
/* Angled */
[data-style="angled"]::view-transition-old(root) {
  animation: none;
  z-index: -1;
}

[data-style="angled"]::view-transition-new(root) {
  animation: unclip 1s;
  clip-path: polygon(-100vmax 100%, 100% 100%, 100% -100vmax);
}

@keyframes unclip {
  0% {
    clip-path: polygon(100% 100%, 100% 100%, 100% 100%);
  }
}

```
and trigger the animations using the view transitions
```tsx
  function transitionColors() {
    if (typeof window !== "undefined") {
      try {
        document.startViewTransition(() => {
          const newTheme = theme === "light" ? "dark" : "light";
          document.documentElement.dataset.theme = newTheme;
          updateTheme(newTheme);
        });
      } catch (error) {
        const newTheme = theme === "light" ? "dark" : "light";
        document.documentElement.dataset.theme = newTheme;
        updateTheme(newTheme);
      }
    }
  }
```

>[!NOTE]
> Remember to add the `data-theme` and `data-style` attribute in the `html` element to make the changes visible

