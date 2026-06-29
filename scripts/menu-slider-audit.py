import asyncio
import os

from playwright.async_api import async_playwright, expect


BASE_URL = os.environ.get("FITERA_TEST_URL", "http://localhost:8080")
RATIONS = {
    "LIGHT": 4,
    "BALANCE": 5,
    "POWER": 6,
    "MOM": 5,
    "PRO": 6,
}
DAYS = range(7)


async def main():
    errors: list[str] = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 1800})
        page.set_default_timeout(10000)
        await page.goto(BASE_URL, wait_until="domcontentloaded")
        await page.wait_for_timeout(1200)

        for ration, expected_count in RATIONS.items():
            select_button = page.locator(f'[data-ration-select="{ration}"]')
            await expect(select_button).to_be_visible()
            await select_button.scroll_into_view_if_needed()
            await select_button.click()

            await page.wait_for_function(
                "line => document.querySelector('[data-menu-slider]')?.dataset.line === line",
                arg=ration,
            )

            for day in DAYS:
                day_button = page.locator(f'[data-menu-day="{day}"]')
                await expect(day_button).to_be_visible()
                await day_button.click()

                await page.wait_for_function(
                    "([line, day]) => { const s = document.querySelector('[data-menu-slider]'); return s && s.dataset.line === line && s.dataset.day === String(day); }",
                    arg=[ration, day],
                )

                slider = page.locator("[data-menu-slider]")
                slides = slider.locator("[data-menu-slide]")
                photo_nodes = slider.locator("[data-menu-photo]")

                slide_count = await slides.count()
                photo_count = await photo_nodes.count()
                if slide_count != expected_count:
                    errors.append(f"{ration} day {day + 1}: expected {expected_count} slides, got {slide_count}")
                if photo_count != expected_count:
                    errors.append(f"{ration} day {day + 1}: expected {expected_count} photos/placeholders, got {photo_count}")

                await page.wait_for_function(
                    "() => Array.from(document.querySelectorAll('[data-menu-slider] [data-menu-photo]')).every((el) => ['loaded', 'fallback'].includes(el.dataset.photoState))"
                )

                states = await photo_nodes.evaluate_all("els => els.map((el) => el.dataset.photoState)")
                invalid_states = [state for state in states if state not in ("loaded", "fallback")]
                if invalid_states:
                    errors.append(f"{ration} day {day + 1}: unresolved photo states {invalid_states}")

                next_button = slider.locator("[data-menu-next]")
                if expected_count > 1:
                    before = await slider.locator('[aria-current="true"]').get_attribute("aria-label")
                    await next_button.click()
                    await page.wait_for_timeout(180)
                    after = await slider.locator('[aria-current="true"]').get_attribute("aria-label")
                    if before == after:
                        errors.append(f"{ration} day {day + 1}: next button did not advance slider")

        await browser.close()

    if errors:
        raise AssertionError("\n".join(errors))
    print("OK: checked all 35 ration/day slider combinations with loaded photos or fallback placeholders.")


if __name__ == "__main__":
    asyncio.run(main())