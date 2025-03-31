import pool from '../db/connection';
import { Category } from '../models/Category';
import { Product } from '../models/Product';

export const categoryResolvers = {
  Query: {
    categories: async (): Promise<Category[]> => {
      const [rows] = await pool.query('SELECT * FROM categories');
      return rows as Category[];
    },
    category: async (_: any, { id }: { id: string }): Promise<Category | null> => {
      const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
      const categories = rows as Category[];
      return categories.length ? categories[0] : null;
    }
  },
  
  Mutation: {
    addCategory: async (_: any, { name }: { name: string }): Promise<Category> => {
      const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
      const id = (result as any).insertId;
      return { id, name } as Category;
    },
    
    updateCategory: async (_: any, { id, name }: { id: string; name: string }): Promise<Category | null> => {
      // Kiểm tra xem danh mục có tồn tại không
      const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
      const categories = rows as Category[];
      
      if (!categories.length) {
        throw new Error(`Danh mục với ID ${id} không tồn tại`);
      }
      
      await pool.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
      
      return { id: parseInt(id), name } as Category;
    },
    
    deleteCategory: async (_: any, { id }: { id: string }): Promise<boolean> => {
      // Kiểm tra xem có sản phẩm nào liên kết với danh mục này không
      const [products] = await pool.query('SELECT * FROM products WHERE categoryId = ?', [id]);
      
      if ((products as any[]).length > 0) {
        throw new Error(`Không thể xóa danh mục vì có ${(products as any[]).length} sản phẩm liên kết`);
      }
      
      const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
      return (result as any).affectedRows > 0;
    }
  },
  
  // Resolver cho trường products trong type Category
  Category: {
    products: async (parent: Category): Promise<Product[]> => {
      const [rows] = await pool.query('SELECT * FROM products WHERE categoryId = ?', [parent.id]);
      return rows as Product[];
    }
  }
};