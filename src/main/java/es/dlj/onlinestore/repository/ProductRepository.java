package es.dlj.onlinestore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.domain.Page; 
import org.springframework.data.domain.Pageable;

import es.dlj.onlinestore.domain.Product;
import es.dlj.onlinestore.enumeration.ProductType;


public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByProductType(ProductType type);

    Page<Product> findByProductType(ProductType type, Pageable pageable);

    List<Product> findByNameContaining(String name);

    Page<Product> findByNameContaining(String name, Pageable pageable);
    
    Long countByProductType(ProductType type);

    // Best Sellers
    List<Product> findTop10ByOrderByTotalSellsDesc();

    // On Sale
    List<Product> findTop10ByOrderBySaleDesc();

    // Low Stock
    List<Product> findByStockLessThan(int stock);

    // Filter products
    @Query("SELECT p FROM Product p WHERE "
        + "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) "
        + "AND (:minPrice IS NULL OR p.price >= :minPrice) "
        + "AND (:maxPrice IS NULL OR p.price <= :maxPrice) "
        // + "AND (:tags IS NULL OR NOT EXISTS (SELECT t FROM ProductTag t WHERE t NOT MEMBER OF p.tags AND t.name IN :tags))"
        // + "AND (:productTypes IS NULL OR p.productType IN :productTypes) "
    )
    Page<Product> searchProducts(String name, Integer minPrice, Integer maxPrice, List<String> tags, List<ProductType> productTypes, Pageable pageable);

    Page<Product> findAllBySellerId(Long id, Pageable pageable);

}
