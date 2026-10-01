const STORAGE_KEY = "recipe-box-recipes";

const sampleRecipes = [
  {
    id: "lemon-pasta",
    name: "Lemony parmesan pasta",
    description: "Silky lemon butter sauce, plenty of parmesan, and fresh cracked pepper.",
  },
  {
    id: "roasted-tomatoes",
    name: "Slow-roasted tomato toast",
    description: "Jammy tomatoes on warm sourdough with whipped ricotta and basil.",
  },
  {
    id: "ginger-soup",
    name: "Ginger & carrot soup",
    description: "A cozy, bright bowl finished with coconut milk and a squeeze of lime.",
  },
];

const form = document.querySelector("#recipe-form");
const nameInput = document.querySelector("#recipe-name");
const descriptionInput = document.querySelector("#recipe-description");
const recipeList = document.querySelector("#recipe-list");
const recipeCount = document.querySelector("#recipe-count");

function loadRecipes() {
  try {
    const savedRecipes = localStorage.getItem(STORAGE_KEY);
    if (savedRecipes === null) {
      return sampleRecipes;
    }

    const recipes = JSON.parse(savedRecipes);
    if (
      !Array.isArray(recipes) ||
      !recipes.every(
        (recipe) =>
          recipe &&
          typeof recipe.id === "string" &&
          typeof recipe.name === "string" &&
          typeof recipe.description === "string",
      )
    ) {
      throw new Error("Saved recipes have an invalid format.");
    }

    return recipes;
  } catch (error) {
    console.error("Unable to load saved recipes.", error);
    return sampleRecipes;
  }
}

let recipes = loadRecipes();

function saveRecipes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error("Unable to save recipes.", error);
  }
}

function renderRecipes() {
  recipeList.replaceChildren();
  recipeCount.textContent = String(recipes.length);

  if (recipes.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";

    const sparkle = document.createElement("span");
    sparkle.setAttribute("aria-hidden", "true");
    sparkle.textContent = "✳";

    const message = document.createElement("p");
    message.textContent = "Your collection is waiting for its next favorite.";

    emptyState.append(sparkle, message);
    recipeList.append(emptyState);
    return;
  }

  for (const recipe of recipes) {
    const card = document.createElement("article");
    card.className = "recipe-card";

    const content = document.createElement("div");
    content.className = "recipe-card-content";

    const title = document.createElement("h3");
    title.textContent = recipe.name;

    const description = document.createElement("p");
    description.textContent = recipe.description;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${recipe.name}`);
    deleteButton.addEventListener("click", () => {
      recipes = recipes.filter((item) => item.id !== recipe.id);
      saveRecipes();
      renderRecipes();
    });

    content.append(title, description);
    card.append(content, deleteButton);
    recipeList.append(card);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const description = descriptionInput.value.trim();
  if (!name || !description) {
    return;
  }

  recipes.unshift({
    id: globalThis.crypto.randomUUID(),
    name,
    description,
  });
  saveRecipes();
  renderRecipes();
  form.reset();
  nameInput.focus();
});

renderRecipes();
