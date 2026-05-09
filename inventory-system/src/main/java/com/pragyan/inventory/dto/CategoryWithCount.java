package com.pragyan.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryWithCount {
    private Long id;
    private String categoryName;
    private long productCount;
}