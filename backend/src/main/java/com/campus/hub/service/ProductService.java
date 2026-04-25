package com.campus.hub.service;

import com.campus.hub.model.Product;
import com.campus.hub.model.User;
import com.campus.hub.repository.ProductRepository;
import com.campus.hub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> searchProducts(String query) {
        return productRepository
                .findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    public Product createProduct(Product product) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        product.setSellerId(user.getId());
        product.setSellerName(user.getName());
        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product updatedProduct) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!existing.getSellerId().equals(user.getId()) && !user.getRole().equals("admin")) {
            throw new RuntimeException("Unauthorized: You can only edit your own products");
        }

        existing.setTitle(updatedProduct.getTitle());
        existing.setDescription(updatedProduct.getDescription());
        existing.setCategory(updatedProduct.getCategory());
        existing.setPrice(updatedProduct.getPrice());
        existing.setContact(updatedProduct.getContact());
        existing.setImageUrl(updatedProduct.getImageUrl());

        return productRepository.save(existing);
    }

    public void deleteProduct(String id) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!existing.getSellerId().equals(user.getId()) && !user.getRole().equals("admin")) {
            throw new RuntimeException("Unauthorized: You can only delete your own products");
        }

        productRepository.deleteById(id);
    }

    public List<Product> getMyProducts() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return productRepository.findBySellerId(user.getId());
    }
}
