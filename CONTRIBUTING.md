# Contributing

Contributions are welcome! Here's how you can contribute:

## Getting Started

1.  **Fork the repository:** Click the "Fork" button at the top right of the repository page.
2.  **Clone the fork:**
    ```bash
    git clone https://github.com/<your-username>/bolt.new-main.git
    cd bolt.new-main
    ```
3.  **Install dependencies:**
    ```bash
    pnpm install
    ```
4.  **Create a new branch:**
    ```bash
    git checkout -b feature/your-feature-name
    ```

## Making Changes

1.  **Develop your changes:** Make your code changes in the new branch.
2.  **Test your changes:** Run the following commands to test your changes:
    ```bash
    pnpm dev
    ```
    This will start a local development server.
    Open `http://localhost:8787` in your browser to see the application.
3.  **Format your code:**
    ```bash
    pnpm format
    ```
4.  **Lint your code:**
    ```bash
    pnpm lint
    ```
5.  **Commit your changes:**
    ```bash
    git add .
    git commit -m "feat(your-scope): your commit message"
    ```
    Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for your commit messages.
6.  **Push your changes:**
    ```bash
    git push origin feature/your-feature-name
    ```

## Submitting a Pull Request

1.  Go to the original repository on GitHub.
2.  Click the "Compare & pull request" button.
3.  Fill out the pull request template and submit your pull request.

## Code Style

-   Use Prettier for code formatting
-   Use ESLint for code linting
-   Follow the existing coding conventions used in the project.

## Reporting Bugs

If you find a bug, please submit an issue on the GitHub repository. Please include the following information in your issue:

-   A clear and descriptive title
-   Steps to reproduce the bug
-   The expected behavior
-   The actual behavior
-   Any relevant screenshots or error messages

## Suggesting Features

If you have an idea for a new feature, please submit an issue on the GitHub repository. Please include the following information in your issue:

-   A clear and descriptive title
-   A description of the feature
-   The motivation for the feature
-   Any relevant use cases or examples

## License

By contributing to this project, you agree that your contributions will be licensed under the [MIT License](LICENSE).

## Questions?

If you have any questions, please submit an issue on the GitHub repository.
