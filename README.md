# Features
- Scraping all match results for NBA, NHL, MLB, NFL and college basketball
- Scraping detailed match data for NBA, NHL, MLB and college basketball
- Scraping articles for NBA, NHL, MLB, NFL and college basketball

# Cost of usage
You can get up to 50 000 results for 1 USD. Number of results per 1 USD varies according to type of scraped data and according to scraped league.

# Input parameters
- **scrapeMatchList** - if true, actor will scrape match results according to other inputs
- **matchListYears** - array of years, for which actor should scrape the match results
- **matchListSeasonTypes** - type of season, for which actor should scrape the match results
    - Allowed values:
    - pre - Pre-season
    - reg - Regular season
    - post - Post-season/Play-off
    - off - Off-season
- **matchListLeagues** - leagues, for which actor should scrape the match results
  - Allowed values: mlb, nhl, nba, wnba, nfl, mens-college-basketball, womens-college-basketball
- **scrapeMatchDetails** - if true, actor will scrape detail data for specified matches
- **detailMatches** - Array of matches, for which actor should scrape the detailed results
    - Allowed formats:
    - ID: e.g.: 401126339
    - URL of match detail e.g.: https://www.espn.com/nhl/game/\_/gameId/401126339
- **matchDetailsLeague** - League of match/matches
    - Allowed values: mlb, nhl, nba, wnba, nfl, mens-college-basketball, womens-college-basketball
- **scrapeNews** - if true, actor will scrape articles from news feed of given league
- **newsLeague** - league, for which actor should scrape the articles
  - Allowed values: mlb, nhl, nba, wnba, nfl, mens-college-basketball, womens-college-basketball
- **debug** - if true, actor will print out additional information

## Input example
```json
{
    "debug": false,
    "scrapeMatchList": true,
    "matchListYears": ["2019"],
    "matchListSeasonTypes": ["reg"],
    "matchListLeagues": ["nba"],
    "scrapeMatchDetails": true,
    "detailMatches": ["https://www.espn.com/nba/game/_/gameId/401360779"],
    "matchDetailsLeague": "nba",
    "scrapeNews": true,
    "newsLeague": "nhl"
}
```

# Output examples
## Match list

```json
{
	"resultType": "matchList",
	"id": "401070217",
	"date": "2018-10-19T00:00Z",
	"venue": {
		"capacity": 21000,
		"fullName": "Wells Fargo Center",
		"city": "Philadelphia",
		"state": "PA"
	},
	"competitors": [
		{
			"id": "20",
			"winner": true,
			"displayName": "Philadelphia 76ers",
			"abbreviation": "PHI",
			"home": true,
			"score": 127
		},
		{
			"id": "4",
			"winner": false,
			"displayName": "Chicago Bulls",
			"abbreviation": "CHI",
			"home": false,
			"score": 108
		}
	],
	"headlines": [
		{
			"long": "Ben Simmons had a triple-double with 13 points, 13 rebounds and 11 assists and Joel Embiid had 30 points and 12 rebounds to lead the Philadelphia 76ers past the Chicago Bulls 127-108 on Thursday night.",
			"short": "Simmons triple-double leads 76ers past Bulls 127-108"
		}
	],
	"attendance": 20302,
	"winnerAbbreviation": "PHI",
	"sport": "basketball",
	"league": "nba",
	"season": 2019,
	"seasonType": "reg",
	"url": "https://site.web.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=20181018"
}

```

## Match detail
### Base information
```json

{
	"resultType": "matchDetail",
	"id": "401360779",
	"date": "2022-03-06T18:00Z",
	"venue": {
		"capacity": 19156,
		"fullName": "TD Garden",
		"city": "Boston",
		"state": "MA"
	},
	"competitors": [
		{
			"id": "2",
			"winner": true,
			"displayName": "Boston Celtics",
			"abbreviation": "BOS",
			"home": true,
			"score": 126
		},
		{
			"id": "17",
			"winner": false,
			"displayName": "Brooklyn Nets",
			"abbreviation": "BKN",
			"home": false,
			"score": 120
		}
	],
	"headlines": [],
	"attendance": 19156,
	"winnerAbbreviation": "BOS",
	"officials": [
		"Zach Zarba",
		"Kevin Cutler",
		"Nick Buchert"
	]
}
```
### Basketball
All base information + basketball specific information
```json
{
	"players": [
		{
			"id": "3202",
			"stats": {
				"MIN": "39",
				"FG": "12-21",
				"3PT": "4-9",
				"FT": "9-10",
				"OREB": "1",
				"DREB": "5",
				"REB": "6",
				"AST": "8",
				"STL": "1",
				"BLK": "2",
				"TO": "7",
				"PF": "2",
				"+/-": "-3",
				"PTS": "37"
			},
			"team": "BKN",
			"position": "PF",
			"name": "Kevin Durant"
		}
	],
	"scoring": [
		{
			"id": "40136077918",
			"homeScore": 2,
			"awayScore": 4,
			"scored": true,
			"description": "Kevin Durant makes 15-foot pullup jump shot",
			"type": "2-pointer",
			"player": {
				"id": "3202",
				"name": "Kevin Durant",
				"team": "BKN"
			},
			"timeInSeconds": 96
		}
	]
}

```
### Hockey
All base information + hockey specific information
```json
{
	"players": [
		{
			"id": "2976844",
			"stats": {
				"+/-": "0",
				"TOI": "30:22",
				"PPTOI": "5:47",
				"SHTOI": "1:36",
				"ESTOI": "22:59",
				"SHFT": "38",
				"G": "1",
				"YTDG": "6",
				"A": "1",
				"S": "5",
				"SM": "1",
				"SOG": "0",
				"FW": "18",
				"FL": "16",
				"FO%": "52.9",
				"GV": "2",
				"BS": "1",
				"HT": "1",
				"TK": "2",
				"PN": "0",
				"PIM": "0"
			},
			"team": "SJ",
			"position": "C",
			"name": "Tomas Hertl"
		},
		{
			"id": "5096",
			"stats": {
				"TOI": "78:10",
				"YTDG": "0",
				"GA": "4",
				"SA": "38",
				"SOS": "0",
				"SOSA": "0",
				"SV": "34",
				"SV%": ".895",
				"ESSV": "30",
				"PPSV": "2",
				"SHSV": "2",
				"PIM": "0"
			},
			"team": "SJ",
			"position": "G",
			"name": "Martin Jones"
		}
	],
	"shooting": [
		{
			"id": "40112633929385",
			"homeScore": 5,
			"awayScore": 4,
			"scored": true,
			"team": "SJ",
			"shooter": {
				"id": "3069411",
				"name": "Barclay Goodrow"
			},
			"assists": [
				{
					"id": "2324313",
					"name": "Erik Karlsson"
				},
				{
					"id": "4063462",
					"name": "Marcus Sorensen"
				}
			],
			"timeInSeconds": 4699,
			"description": "Even Strength Goal Scored by Barclay Goodrow assisted by Erik Karlsson and Marcus Sorensen"
		}
	],
	"penalties": [
		{
			"id": "40112633929195",
			"team": "VGK",
			"punishedPlayer": {
				"id": "5237",
				"name": "Cody Eakin"
			},
			"timeInSeconds": 2953,
			"lengthInMinutes": 5,
			"description": "Penalty to Cody Eakin 5  minutes for Cross checking (Major) (served by Ryan Reaves)"
		}
	]
}

```
### Baseball
All base information + baseball specific information

```json
{
	"players": [
		{
			"id": "32129",
			"stats": {
				"H-AB": "1-4",
				"AB": "4",
				"R": "1",
				"H": "1",
				"RBI": "0",
				"HR": "0",
				"BB": "0",
				"K": "0",
				"#P": "15",
				"AVG": ".275",
				"OBP": ".346",
				"SLG": ".456"
			},
			"team": "NYM",
			"statType": "batting",
			"position": "SS",
			"name": "Francisco Lindor"
		},
		{
			"id": "28968",
			"stats": {
				"IP": "3.0",
				"H": "6",
				"R": "4",
				"ER": "4",
				"BB": "1",
				"K": "2",
				"HR": "1",
				"PC-ST": "67-41",
				"ERA": "3.95",
				"PC": "67"
			},
			"team": "NYM",
			"statType": "pitching",
			"position": "SP",
			"name": "Carlos Carrasco"
		}
	],
	"atBats": [
		{
			"id": "4013565060403",
			"homeScore": 0,
			"awayScore": 4,
			"description": "Bleday homered to right (339 feet), De La Cruz scored.",
			"balls": 2,
			"strikes": 1,
			"outcome": "home-run",
			"pitches": [
				{
					"pitchType": "FF",
					"strike": true,
					"outcome": "foul-ball"
				},
				{
					"pitchType": "FF",
					"strike": false,
					"outcome": "ball"
				},
				{
					"pitchType": "CH",
					"strike": false,
					"outcome": "ball"
				},
				{
					"pitchType": "FF",
					"strike": false,
					"outcome": "home-run"
				}
			],
			"pitcher": {
				"id": "28968",
				"name": "Carlos Carrasco",
				"team": "NYM"
			},
			"batter": {
				"id": "28968",
				"name": "JJ Bleday",
				"team": "MIA"
			}
		},
		{
			"id": "4013565060404",
			"homeScore": 0,
			"awayScore": 4,
			"description": "Stallings popped out to second.",
			"balls": 0,
			"strikes": 0,
			"outcome": "pop-out",
			"pitches": [
				{
					"pitchType": "FF",
					"strike": false,
					"outcome": "pop-out"
				}
			],
			"pitcher": {
				"id": "28968",
				"name": "Carlos Carrasco",
				"team": "NYM"
			},
			"batter": {
				"id": "28968",
				"name": "Jacob Stallings",
				"team": "MIA"
			}
		}
	]
}

```
## Article
```json
{
	"resultType": "article",
	"league": "nhl",
	"title": "Chicago Blackhawks' Patrick Kane: Trade rumors are just rumors",
	"description": "Patrick Kane thinks rumors of him being traded by the rebuilding Blackhawks are just rumors.",
	"content": "<p><a href=\"http://www.espn.com/nhl/player/_/id/3735/patrick-kane\">Patrick Kane</a> is well aware he has been the subject of rampant trade speculation for months ...",
    "url": "https://www.espn.com/nhl/story/_/id/34643731/chicago-blackhawks-patrick-kane-trade-rumors-just-rumors",
	"imageUrl": "https://a.espncdn.com/photo/2019/0221/r504970_600x400_3-2.jpg",
	"publishedAt": "2022-09-23T11:11:00Z"
}

```
