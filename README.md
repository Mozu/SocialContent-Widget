# Theme Widget for the Social Content Application by Mozu (BETA)

This repository contains files for the theme widget that accompanies the [Social Content Application by Mozu](https://staging.mozu.com/docs/guides/mozu-apps/social-content-app-by-mozu.htm) (Beta login required). Add this widget to your Mozu site(s) to display social content feeds on your storefront. 

This widget implementation supports both desktop and mobile sites. You specify the platform you are using when you add the widget to site pages in Mozu Admin.

**Note:** The Social Content App is currently in Beta. The app, the widget, and any accompanying documentation are all subject to change.

This repository is structured to mirror the file structure of the [Mozu Core Theme](https://github.com/Mozu/core-theme), but only the necessary files for the widget are included. These files are based off Mozu Core 9, but widget functionality has been tested on Core 8 and 9.

## Widget Files

This widget adds the following files:
* `scripts/widgets/socialcontent.js`
* `scripts/widgets/SocialContent/`
* `scripts/widgets/socialcontent.js`
* `scripts/widgets/socialcontent.js`
* `scripts/widgets/socialcontent.js`
* `stylesheets/widgets/socialcontent.less`
* `templates/widgets/social/socialcontent.hypr`
* `templates/widgets/social/socialcontent-feed-item.hypr.live`

And updates the following file:
* `theme.json`

## Update Your Theme

1.	Clone or download this repository.
2.	Add or merge the files listed above.
3.	Run Grunt to build the theme.
4.	Upload the resulting ZIP file to Mozu Dev Center.
5.	Install the updated theme to the sandbox you’re working in.
6.	In Mozu Admin, go to **Main > SiteBuilder > Themes**, click the three dots next to the new theme, and click **Apply**.

## Add the Widget to Your Site
1.	In Admin, go to **Main > Site Builder > Editor**.
2.	In the site tree, select the page template or page where you want the feed to appear. You can add feeds to any page that has dropzones.
3.	Switch to the **Widgets** view.
4.	Drag the **Social Content** widget to a dropzone on the page.
5.	Enter the name of the feed you want to display. Ensure that the name you enter exactly matches the name you gave the feed in the **Social Content** dialog.
6.	Set the widget configuration:
  *	**Desktop**—Formats the feed for desktop sites and optionally displays title text for the feed. Any content with an action link goes to the Desktop Action URL you specified when you edited the content.
  *	**Mobile**—Formats the feed for mobile sites, removing any titles and allowing it to function as headerless web content. This allows you to update the content of the feed without updating your mobile app. Any content with an action link goes to the Mobile Action URL you specified when you edited the content.
7.	Click **Save**.

That’s it! No further configuration is necessary.

For more information about the Social Content Application by Mozu, visit the [Mozu Docs](https://staging.mozu.com/docs/guides/mozu-apps/social-content-app-by-mozu.htm). (Beta login required)


