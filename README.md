# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

---

## Math Problem Generation (Local)

The app generates math problems for students based on parameters set in the Admin Panel. These parameters control the number and type of problems, as well as the maximum number used in each problem.

### Parameters Used
- **Age**: Used only when integrated with AI (not used for local generation)
- **Number of Logical Problems**: Used only when integrated with AI (not used for local generation)
- **Number of Additions**: Number of addition problems to generate locally
- **Number of Subtractions**: Number of subtraction (take away) problems to generate locally
- **Max Number for Math Problems**: Maximum number used in any math problem

### Addition Problem Rules
- Generate the specified number of addition problems
- Do not add 0 or numbers less than 3
- Each operand must be at least 3 and at most the max number

### Subtraction (Take Away) Problem Rules
- Generate the specified number of subtraction problems
- The result (sum) should never be 0
- Do not subtract numbers less than 5
- Both operands must be at least 5 and at most the max number

### Homework Session UI
- During a homework session, math problems are displayed as a Vuetify v-list.
- Each problem has a small number input field (v-text-field, type=number, density=compact) for the child to enter their answer.
- The list is editable only during the homework session.
- When the session is complete, the answers are shown in a results view and are read-only.

### Example
If the admin sets:
- Number of Additions: 4
- Number of Subtractions: 3
- Max Number: 20

The app will generate 4 addition problems and 3 subtraction problems, with all numbers between the minimums above and 20.

---

## Environment Variables

The project uses environment variables to manage configuration for different environments (development, production, etc.).

- **.env**: Default environment variables
- **.env.development**: Variables for development mode
- **.env.production**: Variables for production mode

All variables must use the `VUE_APP_` prefix to be accessible in the app code.

### Example Variables
```env
VUE_APP_API_URL=https://api.example.com
```

### Usage in Code
```js
const apiUrl = import.meta.env.VUE_APP_API_URL;
```

### Notes
- Do not commit `.env*` files to version control. They are listed in `.gitignore` by default.
- Update the values as needed for your deployment environments.
