import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShoppingListComponent } from './shopping-list.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserIngredientService } from '@userIngredientService';
import { UserItemService } from '@userItemService';
import { of } from 'rxjs';
import { User } from '@user';
import { UserIngredient } from '@userIngredient';
import { IngredientService } from '@ingredientService';
import { Ingredient } from '@ingredient';
import { UserItem } from '@userItem';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrentUserService } from '@currentUserService';
import { NotificationService } from '@notificationService';

describe('ShoppingListComponent', () => {
  let component: ShoppingListComponent;
  let fixture: ComponentFixture<ShoppingListComponent>;
  let userIngredientService: UserIngredientService;
  let userItemService: UserItemService;
  let currentUserService: CurrentUserService;
  let ingredientService: IngredientService;
  let notificationService: NotificationService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ ShoppingListComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userIngredientService = TestBed.inject(UserIngredientService);
    userItemService = TestBed.inject(UserItemService);
    currentUserService = TestBed.inject(CurrentUserService);
    ingredientService = TestBed.inject(IngredientService);
    notificationService = TestBed.inject(NotificationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load ingredients and items', () => {
      const userIngredients = new UserIngredient({
        ingredients: [{
          id: 'ingredientId'
        }]
      });
      const ingredients = [new Ingredient({
        id: 'ingredientId'
      })];
      const userItems = new UserItem({
        items: [{
          id: 'itemId'
        }]
      });

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredients));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(userItemService, 'get').and.returnValue(of(userItems));

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(userItemService.get).toHaveBeenCalled();
    });

    it('should not load unavailable ingredients and items', () => {
      const userIngredients = new UserIngredient({
        ingredients: [{
          id: 'ingredientId2'
        }]
      });
      const ingredients = [new Ingredient({
        id: 'ingredientId'
      })];
      const userItems = new UserItem({
        items: [{
          id: 'itemId2'
        }]
      });

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredients));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(userItemService, 'get').and.returnValue(of(userItems));

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(userItemService.get).toHaveBeenCalled();
    });

    it('should handle empty ingredients and user ingredients', () => {
      const userIngredients = new UserIngredient({});
      const ingredients = [new Ingredient({
        id: 'ingredientId'
      })];
      const userItems = new UserItem({});

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredients));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(userItemService, 'get').and.returnValue(of(userItems));

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(userItemService.get).toHaveBeenCalled();
    });
  });

  describe('applyFilter', () => {
    it('should reset filters', () => {
      component.ingredientsDataSource = new MatTableDataSource();

      component.applyFilter();

      expect(component.ingredientsDataSource.filter).toEqual('0');
    });
  });

  describe('removeIngredient', () => {
    it('should update user ingredients', () => {
      component.ingredientsDataSource = new MatTableDataSource([{id: 'id', cartQuantity: 10}]);
      component.ingredients = [{id: 'id', amount: 5}]

      spyOn(userIngredientService, 'formattedUpdate');

      component.removeIngredient('id');

      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
    });

    it('should not update user ingredients', () => {
      component.ingredientsDataSource = new MatTableDataSource([{id: 'id', cartQuantity: 1}]);
      component.ingredients = [{id: 'id'}]

      spyOn(userIngredientService, 'formattedUpdate');

      component.removeIngredient('id');

      expect(userIngredientService.formattedUpdate).not.toHaveBeenCalled();
    });
  });

  describe('addIngredient', () => {
    it('should update user ingredients', () => {
      component.ingredientsDataSource = new MatTableDataSource([{id: 'id'}]);
      component.ingredients = [{id: 'id', amount: 5}]

      spyOn(userIngredientService, 'formattedUpdate');

      component.addIngredient('id');

      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
    });

    it('should not update user ingredients', () => {
      component.ingredientsDataSource = new MatTableDataSource([{id: 'id'}]);
      component.ingredients = [{id: 'id'}]

      spyOn(userIngredientService, 'formattedUpdate');

      component.addIngredient('id');

      expect(userIngredientService.formattedUpdate).not.toHaveBeenCalled();
    });
  });

  describe('addIngredientToPantry', () => {
    it('should buy an ingredient', () => {
      component.ingredientsDataSource = new MatTableDataSource([{id: 'id', cartQuantity: 10}]);
      component.itemsDataSource = new MatTableDataSource([]);

      spyOn(component, 'applyFilter');
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(userIngredientService, 'buyUserIngredient');
      spyOn(notificationService, 'setNotification');

      component.addIngredientToPantry('id');

      expect(component.applyFilter).toHaveBeenCalledTimes(2);
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(userIngredientService.buyUserIngredient).toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
    });

    it('should complete the shopping list', () => {
      component.ingredientsDataSource = new MatTableDataSource([{id: 'id', cartQuantity: 10}]);
      component.ingredientsDataSource.filteredData = [];
      component.itemsDataSource = new MatTableDataSource([]);

      spyOn(component, 'applyFilter');
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(userIngredientService, 'buyUserIngredient');
      spyOn(notificationService, 'setNotification');

      component.addIngredientToPantry('id');

      expect(component.applyFilter).toHaveBeenCalledTimes(2);
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(userIngredientService.buyUserIngredient).toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
      expect(component.isCompleted).toBeTrue();
    });

    it('should not buy an ingredient', () => {
      component.ingredientsDataSource = new MatTableDataSource([{id: 'id'}]);
      component.itemsDataSource = new MatTableDataSource([]);

      spyOn(component, 'applyFilter');
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(userIngredientService, 'buyUserIngredient');
      spyOn(notificationService, 'setNotification');

      component.addIngredientToPantry('id');

      expect(component.applyFilter).toHaveBeenCalledTimes(1);
      expect(userIngredientService.formattedUpdate).not.toHaveBeenCalled();
      expect(userIngredientService.buyUserIngredient).not.toHaveBeenCalled();
      expect(notificationService.setNotification).not.toHaveBeenCalled();
    });
  });

  describe('addItem', () => {
    it('should update user items', () => {
      component.itemsDataSource = new MatTableDataSource([]);

      spyOn(userItemService, 'formattedUpdate');

      component.addItem({name: 'name'});

      expect(userItemService.formattedUpdate).toHaveBeenCalled();
    });

    it('should not update user items', () => {
      component.itemsDataSource = new MatTableDataSource([]);

      spyOn(userItemService, 'formattedUpdate');

      component.addItem({name: '   '});

      expect(userItemService.formattedUpdate).not.toHaveBeenCalled();
    });
  });

  describe('removeItem', () => {
    it('should buy a user item', () => {
      component.itemsDataSource = new MatTableDataSource([{name: 'name'}, {name: 'name2'}]);
      component.ingredientsDataSource = new MatTableDataSource([]);

      spyOn(userItemService, 'formattedUpdate');
      spyOn(userItemService, 'buyUserItem');
      spyOn(notificationService, 'setNotification');

      component.removeItem(1);

      expect(userItemService.formattedUpdate).toHaveBeenCalled();
      expect(userItemService.buyUserItem).toHaveBeenCalled();
      expect(notificationService.setNotification);
    });

    it('should complete the shopping list', () => {
      component.itemsDataSource = new MatTableDataSource([{name: 'name'}]);
      component.ingredientsDataSource = new MatTableDataSource([]);
      component.ingredientsDataSource.filteredData = [];
      
      spyOn(userItemService, 'formattedUpdate');
      spyOn(userItemService, 'buyUserItem');
      spyOn(notificationService, 'setNotification');

      component.removeItem(0);

      expect(userItemService.buyUserItem).toHaveBeenCalled();
      expect(component.isCompleted).toBeTrue();
      expect(notificationService.setNotification);
    });
  });

  describe('addAllToPantry', () => {
    it('should open a modal to add all to pantry', () => {
      component.addAllToPantry();

      expect(component.validationModalParams).toBeDefined();
    });
  });

  describe('addAllToPantryEvent', () => {
    it('should add ingredients and items to pantry', () => {
      component.ingredientsDataSource = new MatTableDataSource([{
        cartQuantity: 10
      }, {}]);

      component.itemsDataSource = new MatTableDataSource([{
        name: 'name'
      }]);

      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(userIngredientService, 'buyUserIngredient');
      spyOn(userItemService, 'formattedUpdate');
      spyOn(userItemService, 'buyUserItem');
      spyOn(component, 'applyFilter');
      spyOn(notificationService, 'setNotification');

      component.addAllToPantryEvent(component);

      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(userIngredientService.buyUserIngredient).toHaveBeenCalled();
      expect(userItemService.formattedUpdate).toHaveBeenCalled();
      expect(userItemService.buyUserItem).toHaveBeenCalled();
      expect(component.applyFilter).toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
    });
  });
});
