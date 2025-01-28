package com.nym.server.controller;

import com.nym.server.model.Recipe;
import com.nym.server.repository.RecipeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Collections;

@SpringBootTest
@AutoConfigureMockMvc
class RecipesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RecipeRepository recipeRepository;

    @Test
    void testGetRecipes_EmptyList() throws Exception {
        // Arrange
        when(recipeRepository.findAll()).thenReturn(Collections.emptyList());

        // Act & Assert
        mockMvc.perform(get("/api/recipes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0)); // Проверяем, что список пуст
    }

    @Test
    void testGetRecipes_NonEmptyList() throws Exception {
        // Arrange
        var recipe = new Recipe();
        recipe.setId(1L);
        recipe.setTitle("Test Recipe");
        recipe.setDescription("This is a test recipe.");

        when(recipeRepository.findAll()).thenReturn(Collections.singletonList(recipe));

        // Act & Assert
        mockMvc.perform(get("/api/recipes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1)) // Проверяем, что список содержит 1 рецепт
                .andExpect(jsonPath("$[0].title").value("Test Recipe")) // Проверяем название рецепта
                .andExpect(jsonPath("$[0].description").value("This is a test recipe."));
    }
}
