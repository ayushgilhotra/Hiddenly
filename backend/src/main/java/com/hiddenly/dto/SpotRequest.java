package com.hiddenly.dto;

// This class is used when a user adds a new spot.
// It contains all the fields from the "Add Spot" form.
public class SpotRequest {
    
    private String name;
    private String description;
    private String location;
    private String category;
    private String budgetRange;
    private String imageUrl;

    // --- GETTERS AND SETTERS ---

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBudgetRange() { return budgetRange; }
    public void setBudgetRange(String budgetRange) { this.budgetRange = budgetRange; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
