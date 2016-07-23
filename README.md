# Weather

A module to query a weather api and apply filters and views to the results.  The purpose will be so you can configure certain conditions that need to be met in order to do a particular activity and then it will give you results that can be used to plan your schedule.  It's pretty annoying to have to scan the weather forcast everyday looking for certain conditions.  Especially if you're a gardener like me who needs do things on a repetetive schedule throughout the year but only if the weather conditions are sufficient.  Like you can't spray certain things when it's too hot and sunny.

# Design

```
weather
  .where( weather.createFilter({high: 70, low: 55, wind: '<10', time: '<12'}))
  .where( weather.createFilter({targetDate: 'some date', tolerance: '3 days'}))
  .selectAll(function(days) {
    console.log(days);
  });

var neemOilWeather = weather.createFilter({
  high: 70, 
  low: 50, 
  wind: '<15', 
  time: '<10', 
  conditions: 'partiallyCloudy cloudy drizzle'
});

weather
  .where( neemOilWeather )
  .selectFirst(function(day) {
    console.log(day);
  });
```

This is just the core, there will be a bunch of user friendly interfaces to this backend.


# Possibly a semantically intuitive language like

```
after wednesday days th > 70 and c are sunny
after first day th > 70, before third day th > 80, each day ws < 10
days before sunday th > 70
good weather is th between 60 and 85 and conditions are sunny or partly cloudy
golf weather is good weather
```



