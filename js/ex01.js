import { url } from "./configure.js";

const btn = document.querySelector(".btn");
const overFlow = document.querySelector(".overflow");
const cancel = document.querySelector(".cancel");
const addTodo = document.querySelector(".form-add input");

const save = document.querySelector(".save");
const taskEl = document.querySelector(".task");
const complete = document.querySelector(".task-complete");

const check = document.querySelector(".complete-form span");

async function getTodo() {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("fail");
    }

    const data = await response.json();

    render(data);

    // return data;
  } catch (e) {
    console.log(e.massage);
  }
}

getTodo();

btn.addEventListener("click", function () {
  overFlow.style.display = "flex";

  addTodo.value = "";
});

cancel.addEventListener("click", function (e) {
  e.preventDefault();
  overFlow.style.display = "none";
});

// render ra màn hình
let count;

function render(data) {
  taskEl.innerHTML = "";
  complete.innerHTML = "";
  count = 0;

  data.forEach(({ isCheck, task, id }) => {
    const target = document.createElement("div");
    target.className = "task-item";
    target.dataset.id = id;
    target.dataset.isCheck = `${isCheck}`;
    const input = document.createElement("input");
    input.value = task;
    const tool = document.createElement("div");
    tool.className = "tool-edit";
    target.append(input);
    target.append(tool);
    const trash = document.createElement("button");
    trash.className = "delete";
    trash.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    const edit = document.createElement("button");
    edit.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    const isComplete = document.createElement("button");
    isComplete.innerHTML = `<i class="fa-solid fa-check-to-slot"></i>`;
    isComplete;
    tool.append(trash);
    tool.append(edit);
    tool.append(isComplete);

    if (!isCheck) {
      taskEl.append(target);
    } else {
      count++;
      complete.append(target);
    }
  });

  // const task = document.createElement("div");
  const deleteBtn = document.querySelectorAll(".tool-edit .delete");
  deleteBtn.forEach((deleteItem) => {
    deleteItem.addEventListener("click", handleDelete);
  });
  check.innerText = count;

  //  edit content in a form lement

  const editEl = document.querySelectorAll(".tool-edit button:nth-child(2)");

  editEl.forEach((editItem) => {
    editItem.addEventListener("click", handleEdit);
  });

  // check task completety

  const checkEl = document.querySelectorAll(".tool-edit button:last-child");
  checkEl.forEach((checkItem) => {
    checkItem.addEventListener("click", handleComplete);
  });
}

// Xóa
function handleDelete() {
  const id = this.parentNode.parentNode.dataset.id;

  (async () => {
    try {
      const reponse = await fetch(`${url}/${id}`, {
        method: "DELETE",
      });

      getTodo();
    } catch (error) {
      console.log(error);
    }
  })();
}

// handle Edit content

function handleEdit() {
  overFlow.style.display = "flex";
  const valueForm = this.parentNode.previousSibling.value;
  addTodo.value = valueForm;
  save.addEventListener("click", function () {
    console.log("edit");
  });
}

// do you complete task?

function handleComplete() {
  const isCheck = this.parentNode.parentNode.dataset.isCheck;
  const id = this.parentNode.parentNode.dataset.id;
  const valueForm = this.parentNode.previousSibling.value;

  (async () => {
    const response = await fetch(`${url}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(
        isCheck === "false"
          ? {
              isCheck: true,
              task: `${valueForm}`,
            }
          : {
              isCheck: false,
              task: `${valueForm}`,
            }
      ),
    });
    getTodo();
  })();
}

// the content of a form element has changed
// let valueInput;

// addTodo.addEventListener("change", function (e) {
//   e.preventDefault();
//   valueInput = e.target.value;
//   console.log(e.target.value);
// });

// Post a new content...

save.addEventListener("click", function (e) {
  let valueInput = addTodo.value;
  console.log(valueInput);

  if (valueInput.length) {
    e.preventDefault();
    (async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isCheck: false,
          task: valueInput,
        }),
      });
      getTodo();
    })();
    overFlow.style.display = "none";
  }
});
