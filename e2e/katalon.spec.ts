import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://katalon-test.s3.amazonaws.com/aut/html/form.html');

});

test.describe('Katalon Demo PageTest', () => {
    test('has title', async ({ page }) => {
        await expect(page).toHaveTitle('Demo AUT');
        await page.getByText('First name').clear()
        await page.getByText('First name').fill('Harsh');
        await page.getByText('First name').inputValue().then(value => {
            expect(value).toBe('Harsh');
        });
        await page.getByText('First name').clear()
        await page.getByText('First name').inputValue().then(value => {
            expect(value).toBe('');
        });
    });
});