import "./styles/main.scss";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
    throw new Error("Application root element not found.");
}

app.innerHTML = `
  <main class="game">
    <header class="game__header">
      <h1 class="game__title">BuildNPlay</h1>
      <p class="game__subtitle">
        Ten games. Ten experiments. One developer. No deadlines.
      </p>
    </header>

    <section class="game__stage">
      <canvas
        class="game__canvas"
        id="game-canvas"
        width="800"
        height="600"
      ></canvas>
    </section>

    <footer class="game__footer">
      <p>Experiment 001 · One Button</p>
    </footer>
  </main>
`;
