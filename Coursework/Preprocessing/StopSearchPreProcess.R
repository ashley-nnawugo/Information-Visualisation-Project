library(dplyr)
library(tidyverse)

#Read in stop and search data and sort 
stopnsearch <- read.csv(file ="/Users/ashleynnawugo/Documents/Project/Coursework/Data/stopandsearchovertime.csv")

stopnsearch
all <- subset(stopnsearch, select = c(2:4))

asian <- subset(stopnsearch, select = c(5:7))

black <- subset(stopnsearch, select = c(8:10))

mixed <- subset(stopnsearch, select = c(11:13))

white <- subset(stopnsearch, select = c(14:16))

other <- subset(stopnsearch, select = c(17:19))

unknown <- subset(stopnsearch, select = c(20:22))

asian <- tail(asian, 10)
asian$Asian<-gsub(",","", as.character(asian$Asian))
asian$X.3<-gsub(",","", as.character(asian$X.3))
asian$X.4<-gsub(",","", as.character(asian$X.4))
asian[] <- lapply(asian, function(x) as.numeric(as.character(x)))
asian$asian = rowSums(asian)
asian <- subset(asian, select = c(4))


black <- tail(black, 10)
black$Black<-gsub(",","", as.character(black$Black))
black$X.5<-gsub(",","", as.character(black$X.5))
black$X.6<-gsub(",","", as.character(black$X.6))
black[] <- lapply(black, function(x) as.numeric(as.character(x)))
black$black = rowSums(black)
black <- subset(black, select = c(4))


mixed <- tail(mixed, 10)
mixed$Mixed<-gsub(",","", as.character(mixed$Mixed))
mixed$X.7<-gsub(",","", as.character(mixed$X.7))
mixed$X.8<-gsub(",","", as.character(mixed$X.8))
mixed[] <- lapply(mixed, function(x) as.numeric(as.character(x)))
mixed$mixed = rowSums(mixed)
mixed <- subset(mixed, select = c(4))

white <- tail(white, 10)
white$White<-gsub(",","", as.character(white$White))
white$X.9<-gsub(",","", as.character(white$X.9))
white$X.10<-gsub(",","", as.character(white$X.10))
white[] <- lapply(white, function(x) as.numeric(as.character(x)))
white$white = rowSums(white)
white <- subset(white, select = c(4))
 

other <- tail(other, 10)
other$Other<-gsub(",","", as.character(other$Other))
other$X.11<-gsub(",","", as.character(other$X.11))
other$X.12<-gsub(",","", as.character(other$X.12))
other[] <- lapply(other, function(x) as.numeric(as.character(x)))
other$other = rowSums(other)
other <- subset(other, select = c(4))


unknown <- tail(unknown, 10)
unknown$Unknown<-gsub(",","", as.character(unknown$Unknown))
unknown$X.13<-gsub(",","", as.character(unknown$X.13))
unknown$X.14<-gsub(",","", as.character(unknown$X.14))
unknown[] <- lapply(unknown, function(x) as.numeric(as.character(x)))
unknown$unknown = rowSums(unknown)
unknown <- subset(unknown, select = c(4))

stopnsearch <- subset(stopnsearch, select = c(1))
colnames(stopnsearch)[1] = "Date"

stopnsearch <- tail(stopnsearch, 10)

stopnsearch <- substr(stopnsearch$Date, 1, nchar(stopnsearch$Date) -3)

stopnsearch <- cbind(stopnsearch, asian)
stopnsearch <- cbind(stopnsearch, black)
stopnsearch <- cbind(stopnsearch, mixed)
stopnsearch <- cbind(stopnsearch, white)
stopnsearch <- cbind(stopnsearch, other)
colnames(stopnsearch)[1] = "Date"

#rename and export to csv 
stopnsearch
asian_population <- 4231531/1000
black_population <- 1846890/1000
white_population <- 48289395/1000
mixed_population <- 1224400/1000
other_population <- 563696/1000


normalised <- stopnsearch
normalised$asian <- as.numeric(as.character(normalised$asian))/asian_population
normalised$black <- as.numeric(as.character(normalised$black))/black_population
normalised$white <- as.numeric(as.character(normalised$white))/white_population
normalised$mixed <- as.numeric(as.character(normalised$mixed))/mixed_population
normalised$other <- as.numeric(as.character(normalised$other))/other_population

normalised  <- normalised %>% mutate_if(is.numeric, round)


write.csv(normalised, "/Users/ashleynnawugo/Documents/Project/Coursework/Data/normalised.csv", row.names = FALSE)
 

write.csv(stopnsearch, "/Users/ashleynnawugo/Documents/Project/Coursework/Data/StopSearchSorted.csv", row.names = FALSE)