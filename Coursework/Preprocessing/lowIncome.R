library(dplyr)
library(tidyverse)
library(reshape2)
library(janitor)
library(tibble)

lowIncome <- read.csv("/Users/ashleynnawugo/Documents/Project/Coursework/Data/lowIncomeHomes.csv")

lowIncome <- lowIncome[-c(1:6),]
colnames(lowIncome) <- c("Ethnicity", "Percent", "National Average")

write.csv(lowIncome, "/Users/ashleynnawugo/Documents/Project/Coursework/Data/lowIncome.csv", row.names = FALSE)