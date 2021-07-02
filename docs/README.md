# Documentation

- [Documentation](#documentation)
  - [Commands](#commands)
  - [Key Bindings](#key-bindings)
  - [Actions](#actions)
    - [Available actions](#available-actions)

## Commands

`history` -> Shows the user history

`clear-history` -> Clear the history

`%` -> Categorize files based on mime-type and gets the percentage

`report` -> Report an issue with the cli

[`rpc`](https://github.com/pranavbaburaj/termex/blob/main/docs/rpc.md) -> Check the discord rpc status

`no-rpc` -> Disable discord-rpc

`last` -> Open the last opened file/

## Key Bindings

<table style="width:100%">  
<tr>  
<th>Key</th>  
<th>Action
</tr>  
<tr>  
<td><kbd>Down arrow</kbd> </td>  
<td> Skip to the next file</td>   
</tr>  
<tr>  
<td><kbd>Up arrow </kbd></td>  
<td>Skip to the previous file</td>  
</tr>  
<tr>  
<td><kbd>Return</kbd>or <kbd>Enter</kbd></td>  
<td>Open the selected file</td>  
</tr>  <tr>  
<td><kbd>shift + n</kbd></td>  
<td>Create a new directory</td>  
</tr>  <tr>  
<td><kbd>ctrl + b </kbd></td>  
<td>Bookmark the current file/directory</td>  
</tr>  <tr>  
<td><kbd>shift + b </kbd></td>  
<td>View all the bookmarks</td>  
</tr>  <tr>  
<td><kbd>shift + p </kbd></td>  
<td>Preview markdown file</td>  
</tr>  <tr>  
<td><kbd>shift + left </kbd></td>  
<td>Go to the parent directory </td>  
</tr>  <tr>  
<td><kbd>insert</kbd></td>  
<td>open actions</td>  
</tr>  <tr>  
<td><kbd>ctrl + r </kbd></td>  
<td>Reload the current path</td>  
</tr>  <tr>  
<td><kbd>ctrl + c </kbd></td>  
<td>Exit from termex</td>  
</tr>  <tr>  
<td><kbd>ctrl + n </kbd></td>  
<td>Create a new file</td>  
</tr>  <tr> 
</table>

## Actions

To open up actions, press <kbd>Insert</kbd> in your keyboard

<img src="https://i.imgur.com/2gdCljh.png">

### Available actions

- `env`
  To find all the variables from `.env` files in the current directory.
- `find <stuff-to-find>`
  Find something in the current directory
  <img src="https://i.imgur.com/FoARHqY.gif">
- `%`
  The percent commnd walks through the directory and categorizes files based on mime types. And display the percentage of different types of mime-types.
