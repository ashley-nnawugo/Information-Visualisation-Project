library(dplyr)
library(tidyverse)
library(reshape2)
library(janitor)
library(tibble)

payGap <- read.csv("/Users/ashleynnawugo/Documents/Project/Coursework/Data/payethnicity.csv")

payGap <- t(payGap)
payGap <- payGap %>% row_to_names(row_number = 1)
payGap <- as.data.frame(payGap)
payGap <- tibble::rownames_to_column(payGap, "Year")

payGap$Year <- substring(payGap$Year, 2)
colnames(payGap)[8] <- "Other Asian"
colnames(payGap)[9] <- "Other Black"
colnames(payGap)[10] <- "Other"
colnames(payGap)[11] <- "Other Mixed"
colnames(payGap)[12] <- "Other White"

payGap <- mutate_all(payGap, function(x) as.numeric(as.character(x)))
payGap$Black = rowSums(payGap[,c("BlackAfrican", "Black Caribbean")])
payGap$Black <- payGap$Black / 2

payGap
payGap$Asian = rowSums(payGap[,c("Pakistani", "Bangladeshi", "Other Asian", "Indian")])
payGap$Asian <- payGap$Asian/ 4

payGap <-subset(payGap, select = -c(2:5, 7:9, 11:16))
write.csv(payGap, "/Users/ashleynnawugo/Documents/Project/Coursework/Data/payProcessed.csv", row.names = FALSE)