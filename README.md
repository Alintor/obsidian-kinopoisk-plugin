# Obsidian Kinopoisk Plugin

Easily search movies and tv shows info via Kinopoisk and create notes.

## Description

Search movies and tv shows info in Kinopoisk

Use Kinopoisk.dev API to get the information.

## How to install

Click the link to install the Kinopoisk Search plugin: [Install Link](https://obsidian.md/plugins?id=obsidian-kinopoisk-plugin)

Or, Search in the Obsidian Community plugin. And install it.

## How to use

### 1. Click the ribbon icon, or execute the command "Search in Kinopoisk".

<img width="600" src="https://github.com/Alintor/obsidian-kinopoisk-plugin/blob/master/Assets/search_command.png">

### 2. Search for movies or tv series by keywords.

<img width="600" src="https://github.com/Alintor/obsidian-kinopoisk-plugin/blob/master/Assets/search_quary.png">

### 3. Select the item from the search results.

<img width="600" src="https://github.com/Alintor/obsidian-kinopoisk-plugin/blob/master/Assets/result_list.png">

### 4. Voila! A note has been created.

<img width="600" src="https://github.com/Alintor/obsidian-kinopoisk-plugin/blob/master/Assets/result_note.png">

## Configure plugin in settings

<img width="700"  src="https://github.com/Alintor/obsidian-kinopoisk-plugin/blob/master/Assets/settings.png">

### Get API Token

You need to get API token to use this plugin. Follow the [link](https://kinopoisk.dev/), choose free plan and follow steps.

### New file name

You can set the file name format. The default format is `{{name}} ({{year}})`.

### New file location

Set the folder location where the new file is created. Otherwise, a new file is created in the Obsidian Root folder.

### Template file

You can set the template file location. There is an example template at the bottom.

## Example template

Please also find a definition of the variables used in this template below (see: [Template variables definitions](#template-variables-definitions)).

```
---
Каталог: "[[Фильмы]]"
Название: "{{name}}"
Год: {{year}}
Страна: "{{countries}}"
Жанр: [{{genres}}]
Режиссер: "[[{{director}}]]"
Продолжительность: {{movieLength}}
Статус: В бэклоге
Оценка:
Дата просмотра:
coverUrl: {{posterUrl}}
aliases:
  - "{{name}}"
  - "{{alternativeName}}"
tags:
  - фильм
---

![|300]({{posterUrl}})

# Описание
{{description}}

# Ссылки
- {{kinopoiskUrl}}

```

## Template variables definitions

Please find here a definition of the possible variables to be used in your template. Simply write `{{name}}` in your template, and replace name by the desired data, including:

| name                | description                                                    |
| ------------------- | -------------------------------------------------------------- |
| name                | The title of the movie/tv-show.                                |
| year                | The year when movie/tv-show was made                           |
| countries           | The countries had involved with this movie/tv-show development |
| genres              | Genres of this movie/tv-show                                   |
| director            | The name of the movie director.                                |
| movieLength         | The length of the movie in minutes                             |
| posterUrl           | Movie/tv-show poster image URL.                                |
| alternativeName     | The alternative name of the movie/tv-show                      |
| description         | Movie/tv-show description.                                     |
| kinopoiskUrl        | The URL to movie/tv-show page on Kinopoisk                     |
| seasonsCount        | The count of seasons in tv-show                                |
| seriesInSeasonCount | The average count of episodes in tv-show season                |
| seriesLength        | The average length of the tv-show episode in minutes           |
| isComplete          | Completed tv-show or not (Can be true or false)                |

If you want that countries and genres will be not just strings but list of items, you need put it in properties (YAML) like this: `[{{genres}}]`

## License

[Obsidian Kinopoisk Plugin](https://github.com/Alintor/obsidian-kinopoisk-plugin) is licensed under the GNU AGPLv3 license. Refer to [LICENSE](https://github.com/Alintor/obsidian-kinopoisk-plugin/blob/master/LICENSE.TXT) for more information.
