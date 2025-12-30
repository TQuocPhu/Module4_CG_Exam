package com.backend.service.impl;

import com.backend.entity.Product;
import com.backend.repository.ProductRepository;
import com.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public Page<Product> search(String name, Long categoryId, Double price, int page) {
        Pageable pageable = PageRequest.of(page, 5);
        return productRepository.search(name, categoryId, price, pageable);
    }

    @Override
    public void deleteMany(List<Long> ids) {
        productRepository.deleteAllById(ids);
    }

    @Override
    public Product save(Product product) {
        return productRepository.save(product);
    }
}
