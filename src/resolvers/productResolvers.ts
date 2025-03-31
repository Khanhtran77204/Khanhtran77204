import pool from '../db/connection';
import { Product } from '../models/Product';
import { Category } from '../models/Category';

export const productResolvers = {
  Query: {
    products: async (): Promise<Product[]> => {
      const [rows] = await pool.query('SELECT * FROM products');
      return rows as Product[];
    },
    product: async (_: any, { id }: { id: string }): Promise<Product | null> => {
      const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
      const products = rows as Product[];
      return products.length ? products[0] : null;
    }
  },
  
  Mutation: {
    addProduct: async (_: any, { name, price, description, categoryId }: { 
      name: string; price: number; description: string; categoryId: string 
    }): Promise<Product> => {
      // Kiểm tra xem category có tồn tại không
      const [categories] = await pool.query('SELECT * FROM categories WHERE id = ?', [categoryId]);
      if (!(categories as any[]).length) {
        throw new Error(`Danh mục với ID ${categoryId} không tồn tại`);
      }

      const [result] = await pool.query(
        'INSERT INTO products (name, price, description, categoryId) VALUES (?, ?, ?, ?)',
        [name, price, description, categoryId]
      );
      
      const id = (result as any).insertId;
      return { id, name, price, description, categoryId: parseInt(categoryId) } as Product;
    },
    
    updateProduct: async (_: any, { id, name, price, description, categoryId }: {
      id: string; name?: string; price?: number; description?: string; categoryId?: string;
    }): Promise<Product | null> => {
      // Lấy thông tin sản phẩm hiện tại
      const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
      const products = rows as Product[];
      
      if (!products.length) {
        throw new Error(`Sản phẩm với ID ${id} không tồn tại`);
      }
      
      const currentProduct = products[0];
      
      // Kiểm tra category nếu được cập nhật
      if (categoryId) {
        const [categories] = await pool.query('SELECT * FROM categories WHERE id = ?', [categoryId]);
        if (!(categories as any[]).length) {
          throw new Error(`Danh mục với ID ${categoryId} không tồn tại`);
        }
      }
      
      // Cập nhật các trường nếu chúng được cung cấp
      const updatedName = name !== undefined ? name : currentProduct.name;
      const updatedPrice = price !== undefined ? price : currentProduct.price;
      const updatedDescription = description !== undefined ? description : currentProduct.description;
      const updatedCategoryId = categoryId !== undefined ? categoryId : currentProduct.categoryId;
      
      await pool.query(
        'UPDATE products SET name = ?, price = ?, description = ?, categoryId = ? WHERE id = ?',
        [updatedName, updatedPrice, updatedDescription, updatedCategoryId, id]
      );
      
      return {
        id: parseInt(id),
        name: updatedName,
        price: updatedPrice,
        description: updatedDescription,
        categoryId: parseInt(updatedCategoryId.toString())
      } as Product;
    },
    
    deleteProduct: async (_: any, { id }: { id: string }): Promise<boolean> => {
      const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
      return (result as any).affectedRows > 0;
    }
  },
  
  // Resolver cho trường category trong type Product
  Product: {
    category: async (parent: Product): Promise<Category | null> => {
      const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [parent.categoryId]);
      const categories = rows as Category[];
      return categories.length ? categories[0] : null;
    }
  }
};