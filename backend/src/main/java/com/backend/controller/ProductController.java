package com.backend.controller;

import com.backend.entity.Category;
import com.backend.entity.Product;
import com.backend.service.CategoryService;
import com.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    private final ProductService productService;
    private final CategoryService categoryService;

    @GetMapping
    public Page<Product> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Double price,
            @RequestParam(defaultValue = "1") int page
    ) {
        return productService.search(name, categoryId, price, page);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Product p) {
        if (p.getName().length() < 5 || p.getName().length() > 50) {
            return ResponseEntity.badRequest().body("Tên sản phẩm không hợp lệ");
        }
        if (p.getPrice() < 100000) {
            return ResponseEntity.badRequest().body("Giá phải lớn hơn 100.000");
        }
        return ResponseEntity.ok(productService.save(p));
    }

    @DeleteMapping
    public void deleteMany(@RequestBody List<Long> ids) {
        productService.deleteMany(ids);
    }

    @GetMapping("/categories")
    public List<Category> categories() {
        return categoryService.findAll();
    }
}
