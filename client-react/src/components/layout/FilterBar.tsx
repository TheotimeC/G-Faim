import { useState, FunctionComponent } from "react";
import '../assets/styles/filterbar.css'; 

type FilterBarProps = {
    categories: string[];
    onCategoryChange: (category: string) => void;
};


const FilterBar: FunctionComponent<FilterBarProps> = ({ categories, onCategoryChange }) => {
    const [activeCategory, setActiveCategory] = useState<string>("Tout");
    const handleChangeCategory = (category: string) => {
        // Mettez à jour la catégorie active
        setActiveCategory(category);
        // Appellez la fonction de changement de catégorie passée en props
        onCategoryChange(category);
    }
    return (
      <div className="container-filterbutton">
        <button 
          className={`filterbutton ${activeCategory === "Tout" ? "active" : ""}`} 
          onClick={() => handleChangeCategory("Tout")}
        >
          Tout
        </button>
        <button 
          className={`filterbutton ${activeCategory === "Menu" ? "active" : ""}`} 
          onClick={() => handleChangeCategory("Menu")}
        >
          Menu
        </button>
    
        {categories.map((category, index) => (
          <button 
            className={`filterbutton ${activeCategory === category ? "active" : ""}`} 
            key={index} 
            onClick={() => handleChangeCategory(category)}
            >
            {category}
        </button>
        ))}
      </div>
    );
  };

export default FilterBar;
