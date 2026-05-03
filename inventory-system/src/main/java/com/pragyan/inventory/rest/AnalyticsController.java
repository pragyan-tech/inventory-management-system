package com.pragyan.inventory.rest;

import com.pragyan.inventory.dto.CategoryStockProjection;
import com.pragyan.inventory.dto.DashboardSummary;
import com.pragyan.inventory.dto.TopProductProjection;
import com.pragyan.inventory.service.AnalyticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    public DashboardSummary getDashboardSummary() {
        return analyticsService.getDashboardSummary();
    }
    @GetMapping("/stock-by-category")
    public List<CategoryStockProjection> getStockByCategory() {
        return analyticsService.getStockByCategory();
    }

    @GetMapping("/top-products")
    public List<TopProductProjection> getTopProductsByValue() {
        return analyticsService.getTopProductsByValue();
    }
}