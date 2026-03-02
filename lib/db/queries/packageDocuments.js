// src/lib/db/queries/packageDocuments.js
import { query, transaction } from '../index.js';

export const PackageDocumentQueries = {
    // Get all documents for a package
    async getByPackageId(packageId) {
        const sql = `
            SELECT * FROM package_documents 
            WHERE package_id = ?
            ORDER BY sort_order
        `;
        
        return await query(sql, [packageId]);
    },

    // Get document by ID
    async findById(id) {
        const sql = `SELECT * FROM package_documents WHERE id = ?`;
        const results = await query(sql, [id]);
        return results[0] || null;
    },

    // Get documents by type
    async getByType(packageId, documentType) {
        const sql = `
            SELECT * FROM package_documents 
            WHERE package_id = ? AND document_type = ?
            ORDER BY sort_order
        `;
        
        return await query(sql, [packageId, documentType]);
    },

    // Add document to package
    async add(packageId, documentData) {
        const sql = `
            INSERT INTO package_documents (
                package_id, document_title, document_url, document_type, sort_order
            ) VALUES (?, ?, ?, ?, ?)
        `;
        
        const result = await query(sql, [
            packageId,
            documentData.document_title,
            documentData.document_url,
            documentData.document_type,
            documentData.sort_order || 0
        ]);
        
        return { id: result.insertId, ...documentData };
    },

    // Update document
    async update(id, documentData) {
        const sets = [];
        const values = [];
        
        ['document_title', 'document_url', 'document_type', 'sort_order'].forEach(field => {
            if (documentData[field] !== undefined) {
                sets.push(`${field} = ?`);
                values.push(documentData[field]);
            }
        });
        
        if (sets.length === 0) return null;
        
        values.push(id);
        
        const sql = `
            UPDATE package_documents 
            SET ${sets.join(', ')}
            WHERE id = ?
        `;
        
        await query(sql, values);
        return await this.findById(id);
    },

    // Delete document
    async delete(id) {
        const sql = `DELETE FROM package_documents WHERE id = ?`;
        return await query(sql, [id]);
    },

    // Delete all documents for a package
    async deleteByPackageId(packageId) {
        const sql = `DELETE FROM package_documents WHERE package_id = ?`;
        return await query(sql, [packageId]);
    },

    // Bulk add documents
    async bulkAdd(packageId, documents) {
        return transaction(async (connection) => {
            const results = [];
            
            for (const doc of documents) {
                const sql = `
                    INSERT INTO package_documents (
                        package_id, document_title, document_url, document_type, sort_order
                    ) VALUES (?, ?, ?, ?, ?)
                `;
                
                const result = await connection.execute(sql, [
                    packageId,
                    doc.document_title,
                    doc.document_url,
                    doc.document_type,
                    doc.sort_order || 0
                ]);
                
                results.push({
                    id: result[0].insertId,
                    ...doc
                });
            }
            
            return results;
        });
    },

    // Reorder documents
    async reorder(packageId, documentIds) {
        return transaction(async (connection) => {
            for (let i = 0; i < documentIds.length; i++) {
                const sql = `
                    UPDATE package_documents 
                    SET sort_order = ? 
                    WHERE id = ? AND package_id = ?
                `;
                await connection.execute(sql, [i + 1, documentIds[i], packageId]);
            }
            return { success: true };
        });
    },

    // Get document types summary
    async getTypesSummary(packageId) {
        const sql = `
            SELECT 
                document_type,
                COUNT(*) as count
            FROM package_documents
            WHERE package_id = ?
            GROUP BY document_type
            ORDER BY 
                CASE document_type
                    WHEN 'itinerary' THEN 1
                    WHEN 'booking_form' THEN 2
                    WHEN 'info_sheet' THEN 3
                    WHEN 'brochure' THEN 4
                    ELSE 5
                END
        `;
        
        return await query(sql, [packageId]);
    },

    // Check if document exists
    async exists(packageId, documentTitle) {
        const sql = `
            SELECT COUNT(*) as count 
            FROM package_documents 
            WHERE package_id = ? AND document_title = ?
        `;
        
        const results = await query(sql, [packageId, documentTitle]);
        return results[0]?.count > 0;
    }
};