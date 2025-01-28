package com.nym.server.controller;


import com.nym.server.model.Image;
import com.nym.server.model.Recipe;
import com.nym.server.model.Step;
import com.nym.server.repository.RecipeRepository;
import com.nym.server.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api")
public class RecipesController {

    private static final String EXTERNAL_IMAGE_API = "https://image.pollinations.ai/prompt/";

    @Autowired
    RecipeRepository recipeRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/recipes")
    public ResponseEntity<?> AllRecipes(){

        List<Recipe> recipes = recipeRepository.findAll();

        return ResponseEntity.ok().body(recipes);
    }
    @GetMapping("/recipes/user/{user_id}")
    public ResponseEntity<?> GetRecipesByUser(@PathVariable Long user_id){
        List<Recipe> recipes = recipeRepository.findAllByAuthorID(user_id);
        return ResponseEntity.ok().body(recipes);
    }

    @GetMapping("/recipes/{recipe_id}")
    public ResponseEntity<?> GetRecipe(@PathVariable Long recipe_id){
        Optional<Recipe> recipe = recipeRepository.findById(recipe_id);
        if(recipe.isPresent()){
            return ResponseEntity.ok().body(recipe.get());
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/recipes/{recipe_id}")
    public ResponseEntity<?> DeleteOwnRecipe(@PathVariable Long recipe_id) {
        // Получаем текущего пользователя из токена
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Проверяем пользователя
        var userResp = userRepository.findByUsername(username);
        if (userResp.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Пользователь не найден!");
        }

        var user = userResp.get();

        // Проверяем рецепт
        var recipeResp = recipeRepository.findById(recipe_id);
        if (recipeResp.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Рецепт не найден!");
        }

        var recipe = recipeResp.get();

        // Проверяем, является ли пользователь автором рецепта
        if (!recipe.getAuthorID().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Вы не можете удалить чужой рецепт!");
        }

        // Удаляем рецепт
        recipeRepository.deleteById(recipe_id);
        return ResponseEntity.ok("Рецепт удалён!");
    }

    @PostMapping("/recipes")
    public ResponseEntity<?> AddRecipe(@RequestBody Recipe recipe) {
        try {
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            var user = userRepository.findByUsername(username);

            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Пользователь не найден");
            }

            recipe.setAuthorID(user.get().getId());

            var shortTitle = recipe.getTitle().replaceAll("[\\p{Punct}\\s]+", "");
            if (shortTitle.length() > 50) {
                shortTitle = shortTitle.substring(0, 50);
            }
            var imageUrl = EXTERNAL_IMAGE_API + shortTitle;
            recipe.setImageUrl(imageUrl);

            for (Step step : recipe.getSteps()) {
                var shortDescription = step.getDescription().replaceAll("[\\p{Punct}\\s]+", "");
                if (shortDescription.length() > 50) {
                    shortDescription = shortDescription.substring(0, 50);
                }
                var stepImageUrl = EXTERNAL_IMAGE_API + shortDescription;
                if (stepImageUrl.length() > 255) {
                    stepImageUrl = stepImageUrl.substring(0, 255);
                }

                var image = new Image();
                image.setUrl(stepImageUrl);
                step.setImage(image);
            }

            List<Step> steps = recipe.getSteps();
            steps.sort(Comparator.comparing(Step::getStepN));
            recipe.setSteps(steps);

            var response = recipeRepository.save(recipe);
            return ResponseEntity.ok().body(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка сохранения рецепта: " + e.getMessage());
        }
    }








    @PostMapping("/recipes/like")
    public ResponseEntity<?> LikeRecipe(@RequestParam Long recipeID) {

        try {
            // Получаем текущего пользователя
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            String name = authentication.getName();

            var userResp = this.userRepository.findByUsername(name);
            if (userResp.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Пользователь не найден!");
            }

            var user = userResp.get();

            // Проверяем, существует ли рецепт
            var recipe = recipeRepository.findById(recipeID);
            if (recipe.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Рецепт не найден!");
            }

            // Проверяем наличие рецептов у пользователя
            Set<Recipe> favoriteRecipes = user.getRecipes();
            if (favoriteRecipes == null) {
                favoriteRecipes = new HashSet<>();
                user.setRecipes(favoriteRecipes);
            }

            // Добавляем или удаляем из избранного
            if (favoriteRecipes.contains(recipe.get())) {
                favoriteRecipes.remove(recipe.get());
            } else {
                favoriteRecipes.add(recipe.get());
            }

            // Сохраняем изменения
            this.userRepository.save(user);
            return ResponseEntity.ok("Избранное обновлено!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка сервера: " + e.getMessage());
        }
    }


    @GetMapping("/recipes/liked")
    public ResponseEntity<?> GetLikedRecipes() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        var userResp = userRepository.findByUsername(username);
        if (userResp.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Пользователь не найден");
        }
        return ResponseEntity.ok().body(userResp.get().getLikedRecipes());
    }

    @PostMapping("/recipes/unlike")
    public ResponseEntity<?> UnlikeRecipe(@RequestParam Long recipeID) {
        // Получаем текущего пользователя из токена
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Проверяем пользователя
        var userResp = userRepository.findByUsername(username);
        if (userResp.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Пользователь не найден!");
        }

        var user = userResp.get();

        // Проверяем рецепт
        var recipeResp = recipeRepository.findById(recipeID);
        if (recipeResp.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Рецепт не найден!");
        }

        var recipe = recipeResp.get();

        // Если рецепт в избранном — удаляем
        if (user.getRecipes().contains(recipe)) {
            user.getRecipes().remove(recipe);
            userRepository.save(user); // Сохраняем изменения
            return ResponseEntity.ok("Рецепт удалён из избранного!");
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Рецепт не найден в избранном!");
    }

}
