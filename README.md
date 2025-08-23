# Playwright TypeScript Automation Framework

A comprehensive end-to-end testing framework built with Playwright and TypeScript for modern web applications.

## 🚀 Features

- **Cross-browser testing** - Run tests on Chromium, Firefox, and WebKit
- **TypeScript support** - Full type safety and IntelliSense
- **Parallel execution** - Fast test execution with built-in parallelization
- **Auto-wait functionality** - Intelligent waiting for elements and network requests
- **Mobile testing** - Test responsive designs and mobile devices
- **Visual regression testing** - Screenshot comparison capabilities
- **CI/CD ready** - GitHub Actions, Jenkins, and other CI platforms
- **Detailed reporting** - HTML reports with traces, screenshots, and videos

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/playwright-ts-framework.git
cd playwright-ts-framework
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## 📁 Project Structure

```
├── tests/
│   ├── e2e/                 # End-to-end test files
│   ├── api/                 # API test files
│   └── visual/              # Visual regression tests
├── pages/                   # Page Object Model classes
├── fixtures/                # Test fixtures and test data
├── utils/                   # Helper utilities and functions
├── config/                  # Environment configurations
├── playwright.config.ts     # Playwright configuration
├── package.json
└── README.md
```

## ⚙️ Configuration

### Playwright Configuration (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: 'https://your-app.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
```

### Environment Configuration

Create `.env` files for different environments:

```bash
# .env.local
BASE_URL=http://localhost:3000
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=password123
```

## 🧪 Writing Tests

### Basic Test Example

```typescript
import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Welcome/);
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
});
```

### Page Object Model Example

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### Using Page Objects in Tests

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('user can login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.goto();
  await loginPage.login('test@example.com', 'password123');
  
  await expect(page).toHaveURL('/dashboard');
});
```

### API Testing Example

```typescript
import { test, expect } from '@playwright/test';

test('API - get user data', async ({ request }) => {
  const response = await request.get('/api/users/1');
  
  expect(response.status()).toBe(200);
  
  const user = await response.json();
  expect(user).toHaveProperty('id', 1);
  expect(user).toHaveProperty('email');
});
```

## 🏃‍♂️ Running Tests

### Run all tests
```bash
npm run test
```

### Run tests in headed mode
```bash
npm run test:headed
```

### Run tests in specific browser
```bash
npm run test -- --project=chromium
```

### Run specific test file
```bash
npm run test tests/login.spec.ts
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Generate and view test report
```bash
npm run report
```

## 📊 Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:ui": "playwright test --ui",
    "report": "playwright show-report",
    "install:browsers": "playwright install"
  }
}
```

## 🔧 Utilities

### Custom Test Fixtures

```typescript
// fixtures/base.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type Fixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

export { expect } from '@playwright/test';
```

### Test Data Management

```typescript
// fixtures/testData.ts
export const testUsers = {
  admin: {
    email: 'admin@example.com',
    password: 'admin123'
  },
  user: {
    email: 'user@example.com',
    password: 'user123'
  }
};

export const testUrls = {
  login: '/login',
  dashboard: '/dashboard',
  profile: '/profile'
};
```

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npm run test
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

## 📝 Best Practices

1. **Use Page Object Model** - Organize your code with page objects for maintainability
2. **Wait for elements** - Use Playwright's auto-waiting features instead of hard waits
3. **Use data-testid** - Add data-testid attributes for reliable element selection
4. **Parallel execution** - Run tests in parallel for faster execution
5. **Clean test data** - Ensure tests clean up after themselves
6. **Environment isolation** - Use different environments for different test stages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues

If you encounter any issues, please file them [here](https://github.com/your-username/playwright-ts-framework/issues).

---

**Happy Testing! 🎭**