# Overview

This project allows you to effortlessly launch your blog by writing posts in Markdown. It handles the publishing process seamlessly, so you can focus on creating content while it takes care of the rest. I’ve always wanted to help others create modern blog websites with minimal code and no programming experience—this project is the solution.

**Key Features**

- Simple user dashboard used to create and manage your blog posts.
- User authentication - setup your own credentials
- Sharable blog posts - Ability to share your blog posts to other social networks.

**Technologies Used**

- [Nextjs (reactjs)](https://nextjs.org/)
- Vercel Blob - [learn more](https://vercel.com/storage/blob)
- [Tailwindcss](https://tailwindcss.com/)
- [Gray-matter](https://www.npmjs.com/package/gray-matter)

## Installation and Setup

### **Create your credentials**

For you to setup your credentials, you need to download the appropriate binary for your operating system [here](https://github.com/katongole-isaac/blog/releases/tag/v0.1 "credentials-cli")

- **For Windows** - Download `credentials-win.exe`  
- **For MacOS** - Download `credentials-macos`  
- **For Linux** - Download `credentials-linux`  

**Usage**  

For windows   

- Open a terminal (Command Prompt or PowerShell) and navigate to the downloaded file's location.
- Run the following command
```sh
.\credentials-win.exe
```

For macos or linux  

- Open a terminal and run the following commands

Navigate to your downloads

```sh
cd Downloads
```

Setup execute permission to the file

```sh
chmod +x credentials-linux
```

Run it

```sh
./credentials-linux
```

NOTE: You will need to setup environment variables with the generated user credentials.  
**Please keep them safe**

### Environment Variables  

For those who are deploying on vercel you might find [this](https://vercel.com/docs/projects/environment-variables) useful on how to setup environment variables in the project dashboard.

## Customization & Configuration
You might want to do some customization forexample changing the app logo, app name, and others. For this i assume you have some basic knowledge on how Nextjs(App router) works.   
But if you don't have, feel free to shoot me an [email](mailto:katongolelsaac78@gmail.com) i might help you get it done in minutes.

**What you can change**
- Google Analytics ID (supply yours in `.env` file)
-  App logo and app name
- Anything you feel like as long as you're comfortable with reactjs and Nextjs in particular.  


## Deployments
- **Vercel**  
It shouldn't be difficult to deploy this project on vercel. All you have to 