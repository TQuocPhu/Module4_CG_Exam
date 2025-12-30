package com.backend.service;

import com.backend.entity.Product;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {

    Page<Product> search(String name, Long categoryId, Double price, int page);

    void deleteMany(List<Long> ids);

    Product save(Product p);
}
