library(dplyr)
library(tidyverse)
library(reshape2)

conviction <- read.csv("/Users/ashleynnawugo/Documents/Project/Coursework/Data/conviction_rate.csv")
conviction <- head(conviction, 45)
conviction <- conviction[-c(1,3,5:9,11:13)]
colnames(conviction) <- c("Ethnicity", "Year", "Percent")

conviction <- dcast(conviction, Year ~ Ethnicity)

View(conviction)
colnames(conviction)[5] <- "Other"

write.csv(conviction, "/Users/ashleynnawugo/Documents/Project/Coursework/Data/convictionProcessed.csv", row.names = FALSE)