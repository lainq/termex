# Discord RPC

Discord RPC is an optional feature that you can use along with termex. To enable discord-rpc, follow these steps.

Before getting started, make sure you are logged in with your discord account

- Create a discord application

Head on to the [Discord developer portal](https://discord.com/developers/applications) and create a new application.

<img src="https://user-images.githubusercontent.com/70764593/124238859-b49f7c80-db36-11eb-9b1f-bed02b78fbda.png">

- Copy the application id

> _NOTE_: The application id in the image is not real.

<img src="https://user-images.githubusercontent.com/70764593/124239487-5f179f80-db37-11eb-9fc1-4efed62eb43d.png">

- Go to the rich presence tab and upload the assets.

Upload [this](https://github.com/pranavbaburaj/termex/blob/main/assets/rpc/termex.png) image with `termex` as the asset key

<img src="https://user-images.githubusercontent.com/70764593/124240510-6ee3b380-db38-11eb-942a-74a14ca8530a.png" height=
"100">

> **NOTE**: Make sure that the asset key is `termex`
>
> <img src="https://user-images.githubusercontent.com/70764593/124240746-ace0d780-db38-11eb-967e-e7a39ca6a475.png">

- Enable RPC

Inorder to start using rpc, you will have to enable it with the cli.

```sh
# enable rpc
termex rpc --enable
```

You will be asked to enter your application id.

<img src="https://user-images.githubusercontent.com/70764593/124247948-ff71c200-db3f-11eb-951b-117810af26bf.png">.

Next time you run termex, you will have custom discord-rpc based on termex.

> _NOTE_:It will take 15 seconds for rpc to appear on your profile.

<img src="https://user-images.githubusercontent.com/70764593/124260133-f1766e00-db4c-11eb-971e-3bbca58ac5ac.png">
