library(dplyr)
library(tidyverse)


householdWealth <- read.csv("/Users/ashleynnawugo/Documents/Project/Coursework/Data/householdWealth.csv")


householdWealth <- householdWealth[-c(0:6),]
colnames(householdWealth) <- c("Ethnicity", "Median", "Mean")
householdWealth <- householdWealth[-c(10),]
householdWealth

write.csv(householdWealth, "/Users/ashleynnawugo/Documents/Project/Coursework/Data/WealthProcessed.csv", row.names = FALSE)