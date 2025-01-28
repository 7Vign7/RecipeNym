package com.nym.server.controller;

import com.nym.server.repository.RecipeRepository;
import com.nym.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") // Проверка роли на уровне контроллера
public class AdminController {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok().body(userRepository.findAll());
    }

    @GetMapping("/recipes")
    public ResponseEntity<?> getAllRecipes() {
        return ResponseEntity.ok().body(recipeRepository.findAll());
    }

    // Удаление рецепта по ID
    @DeleteMapping("/recipes/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable Long id) {
        if (recipeRepository.existsById(id)) {
            recipeRepository.deleteById(id);
            return ResponseEntity.ok().body("Рецепт удален.");
        }
        return ResponseEntity.notFound().build();
    }

    // Удаление пользователя по ID
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok().body("Пользователь удален.");
        }
        return ResponseEntity.notFound().build();
    }
}
