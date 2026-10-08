# Development Rules

## 1. General

- Follow PRD.md for product requirements.
- Follow ARCHITECTURE.md for system structure.
- Follow DESIGN.md for UI and UX decisions.
- Keep the project modular and maintainable.
- Use clear and meaningful names for files, variables, functions, classes, and components.
- Keep functions and modules focused on a single responsibility.
- Avoid unnecessary complexity.
- Do not duplicate logic.
- Reuse existing components and utilities whenever possible.
- Do not modify unrelated files when implementing a feature.
- Do not add unnecessary dependencies.
- Do not implement features that are outside the defined project scope without discussion.

---

## 2. Before Coding

Before implementing a new feature:

1. Read the relevant project documentation.
2. Inspect the existing project structure.
3. Check whether similar functionality already exists.
4. Reuse existing code where appropriate.
5. Identify which modules will be affected.
6. Make a short implementation plan for large changes.
7. Implement the smallest working version first.
8. Test the implementation before moving to the next feature.

---

## 3. Project Architecture

- Follow the architecture defined in ARCHITECTURE.md.
- Keep frontend, backend, ML, data processing, and Digital Twin logic separated.
- Do not place machine learning logic inside UI components.
- Do not place UI logic inside ML modules.
- Digital Twin logic must remain inside the `digital_twin/` module.
- Data preprocessing logic should remain inside the appropriate data/ML modules.
- Backend APIs should handle communication between the frontend and backend services.
- Reusable frontend components should be placed in the appropriate component directory.
- Keep business logic separate from presentation logic.

---

## 4. Data Rules

- Keep raw and processed datasets separate.
- Raw datasets must not be modified directly.
- Store processed datasets separately from raw datasets.
- Document important preprocessing steps.
- Handle missing values explicitly.
- Validate input data before processing.
- Maintain consistent data formats.
- Do not commit sensitive patient information to GitHub.
- Do not commit private medical records or personally identifiable health information.
- Use anonymized or publicly available datasets for development whenever possible.

---

## 5. Machine Learning Rules

- Keep ML code separate from application UI code.
- Document the purpose of each ML model.
- Clearly define input features and expected outputs.
- Perform appropriate data preprocessing before model training.
- Separate training and evaluation data.
- Avoid data leakage between training and testing datasets.
- Record important evaluation metrics.
- Do not claim that an ML model provides medical diagnosis unless clinically validated.
- Treat ML outputs as research/monitoring indicators rather than autonomous medical decisions.
- Keep trained model files separate from source code when appropriate.

---

## 6. Digital Health Twin Rules

- The Digital Health Twin must represent patient-specific health information.
- Keep the Digital Twin state consistent with the available patient data.
- New health data should update the appropriate patient profile information.
- Digital Twin updates should be traceable where practical.
- Do not invent patient health information.
- Do not make autonomous treatment decisions.
- Do not present experimental predictions as confirmed medical diagnoses.
- Keep Digital Twin logic separate from the frontend interface.

---

## 7. UI / Frontend Rules

- Follow DESIGN.md.
- Maintain consistent typography, colors, spacing, and components.
- Use reusable components instead of duplicating UI code.
- Maintain responsive design.
- Include loading states.
- Include empty states.
- Include error states.
- Provide clear feedback after important user actions.
- Use accessible forms and labels.
- Do not rely only on color to communicate health status.
- Keep health information easy to understand.
- Avoid unnecessary animations and decorative elements.

---

## 8. Backend Rules

- Keep API logic organized and modular.
- Validate incoming data.
- Return clear and consistent responses.
- Handle errors properly.
- Do not expose sensitive information through API responses.
- Keep business logic separate from API routing where practical.
- Do not hard-code credentials or secrets.
- Document important API endpoints.

---

## 9. Security Rules

- Never expose API keys, passwords, tokens, or credentials.
- Never commit `.env` files containing secrets.
- Store secrets using environment variables.
- Validate user input.
- Validate uploaded or imported data.
- Avoid exposing sensitive patient information.
- Do not commit real patient medical records to GitHub.
- Use anonymized datasets during development.
- Apply appropriate access controls when authentication is implemented.

---

## 10. Testing Rules

- Test important functionality before considering a feature complete.
- Test data preprocessing logic.
- Test ML-related functionality where practical.
- Test Digital Twin update functionality.
- Test important backend endpoints.
- Test important frontend components.
- Test error and empty states.
- Run existing tests after significant changes.
- Fix failing tests before continuing.
- Do not remove tests simply to make the project pass.

---

## 11. Documentation Rules

- Keep PRD.md updated when product requirements change.
- Keep ARCHITECTURE.md updated when system architecture changes.
- Keep DESIGN.md updated when major design decisions change.
- Document important implementation decisions.
- Add comments only where they improve understanding.
- Avoid unnecessary comments that simply repeat the code.
- Keep README.md updated with setup and usage instructions.

---

## 12. Dependencies

- Prefer existing project dependencies when they are sufficient.
- Add a new dependency only when there is a clear reason.
- Avoid duplicate libraries that solve the same problem.
- Keep dependencies documented.
- Check compatibility before adding major dependencies.

---

## 13. Git Rules

- Make small, focused commits.
- Use descriptive commit messages.
- Do not commit generated files unnecessarily.
- Do not commit secrets or sensitive healthcare information.
- Do not commit large raw datasets unless explicitly required.
- Review `git status` before committing.
- Review important changes before pushing.
- Keep the `main` branch stable.
- Use feature branches for large or risky changes when appropriate.

### Commit Message Examples

```text
Add project requirements document
Add data preprocessing module
Implement patient health profile
Add health risk prediction model
Create digital twin update logic
Add health monitoring dashboard
Fix patient data validation