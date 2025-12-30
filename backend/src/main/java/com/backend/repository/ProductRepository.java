package com.backend.repository;

import com.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {
    @Query("""
        SELECT p FROM Product p
        WHERE (:name IS NULL OR p.name LIKE %:name%)
        AND (:categoryId IS NULL OR p.category.id = :categoryId)
        AND (:price IS NULL OR p.price >= :price)
    """)
    Page<Product> search(
            @Param("name") String name,
            @Param("categoryId") Long categoryId,
            @Param("price") Double price,
            Pageable pageable
    );
}
