library(janitor)

infantMortality <- read.csv(file ="/Users/ashleynnawugo/Documents/Project/Coursework/Data/infantMort.csv")

infantMortality %>% row_to_names(row_number = 1)
View(infantMortality)

write.csv(infantMortality, "/Users/ashleynnawugo/Documents/Project/Coursework/Data/infantCleaned.csv", row.names = FALSE)

